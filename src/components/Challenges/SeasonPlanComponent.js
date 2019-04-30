import React, {Component, Fragment} from 'react';
import {Body, Button, Container, Content, H3, Header, Icon, Left, Right, Text, Title} from 'native-base';
import {Animated, Easing, FlatList, Image, RefreshControl, StyleSheet, View} from 'react-native'
import * as Constants from "expo";
import {Query} from "react-apollo";
import {CURRENT_CHALLENGES, CURRENT_SEASONPLAN} from "../../network/Challenges.gql";
import material from "../../../native-base-theme/variables/material";
import {ChallengeDetailsModal, ChallengeDetailsModalContent} from "./ChallengeDetailsModalContent";
import * as PropTypes from "prop-types";
import {FSModal} from "../Common/FSModal";
import {CreateTeamModalContent} from "../Competitve/CreateTeamModalContent";

let refetchers = [];


export class SeasonPlanComponent extends Component {
    static navigationOptions = {
        title: 'Woche',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='star' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    state = {
        refreshing: false
    };
    reload = () => {
        refetchers.map(refetch => {
            refetch()
        });
    }

    renderCurrentTopic = () => {
        return (
            <Query query={CURRENT_SEASONPLAN}>
                {({loading, error, data, refetch}) => {
                    refetchers.push(refetch);
                    if (loading) return <Text>Loading...</Text>;
                    if (error) return <Text>Error {error.message}</Text>;
                    if (data.globalCurrentChallenges) {
                        const themenwoche = data.globalCurrentChallenges.themenwoche;
                        return (
                            <Content
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing || loading}
                                        onRefresh={() => this.reload()}
                                    />
                                }
                            >
                                <RenderThemenwocheComponent themenwoche={themenwoche}/>
                            </Content>
                        )
                    }
                    return (
                        <Text>no current challenges!</Text>
                    )
                }}
            </Query>
        )
    };

    render() {
        return (
            <Container>
                <Header style={{paddingTop: Constants.statusBarHeight}}>
                    <Left/>
                    <Body>
                        <Title>Challenges</Title>
                    </Body>
                    <Right/>
                </Header>


                <Query query={CURRENT_CHALLENGES}>
                    {({loading, error, data, refetch}) => {
                        refetchers.push(refetch);

                        if (loading) return <Text>Loading...</Text>;
                        if (error) return <Text>Error {error.message}</Text>;
                        if (data.currentChallenges) {
                            const challenges = data.currentChallenges;
                            console.log(challenges);
                            return (
                                <Fragment>
                                    <ChallengeProgressIndicator challenges={challenges}/>
                                    <Container style={{
                                        flex: 1,
                                        margin: 10,
                                    }}>

                                        {this.renderCurrentTopic()}
                                    </Container>
                                    <Container style={{
                                        flex: 3,
                                        margin: 10,
                                    }}>

                                        <ChallengesComponent challenges={challenges} refetch={refetch}/>
                                    </Container>
                                </Fragment>
                            )
                        } else {
                            return (<Text>ERR</Text>)
                        }
                    }}
                </Query>

            </Container>
        );
    }
}

const RenderThemenwocheComponent = ({themenwoche}) => {
    //TODO hier müssen noch deutlich mehr Sachen berücksichtigt werden,
    // das Design sieht aber nicht mehr vor.
    // Mindestens der Titel und die Laufzeit des aktuellen SPs sollen dargestellt werden

    // TODO integrate progress indicator? or move that to external component?

    return (
        <View style={styles.RenderThemenwocheComponent}>
            <H3 style={{color: material.brandDark, paddingBottom: 10}}>Thema:</H3>
            <Text>{themenwoche.content}</Text>
        </View>
    )
};

const ChallengesComponent = (props) => {
    let {challenges, refetch} = props;
    console.log("ChallengesComponent: " + challenges);
    return (
        <View style={{flex: 1}}>
            <FlatList
                data={challenges}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({item}) => {
                    return <ChallengeButton key={item.id} challenge={item} refetch={refetch}/>
                }
                }
            />
        </View>
    )
}

class ChallengeButton extends Component {

    render() {
        let {challenge, refetch} = this.props;
        return (
            <View style={styles.Challenge}>
                <FSModal
                    ref={(ref) => {
                        this.challengeModal = ref;
                    }}
                    body={<ChallengeDetailsModalContent
                        challenge={challenge}
                        refetch={refetch}

                        requestModalClose={() => this.challengeModal.closeModal()}/>}
                >
                    <Button block
                            light={!challenge.challengeCompletion}
                            primary={!!challenge.challengeCompletion}
                            onPress={() => this.challengeModal.openModal()}>
                        <Text>{challenge.challenge.title}</Text>
                        {challenge.challengeCompletion &&
                        <Icon name="md-checkmark"/>
                        }
                    </Button>
                </FSModal>
            </View>
        )
    }
}

function ChallengeProgressIndicator(props) {
    //TODO replace with something actually good and move to parent component for better layout options,
    // also steal overlaying layout code from FAB

    const {challenges} = props;
    const challengeCompletions = challenges.map(challenge => challenge.challengeCompletion).filter(Boolean);
    console.log(`Challenges completed: ${challengeCompletions.length}/${challenges.length}`);
    return (
        <View style={{
            height: 48,
            padding: 10,
            paddingBottom: 10,
        }}>
            <ChallengeProgressBar progress={challengeCompletions.length}/>
        </View>
    )
}

class RenderProgressDot extends Component {

    state = {
        fadeAnim: new Animated.Value(0),
        showImg: 0,
    };

    componentDidMount() {
        this.setState({showImg: (this.props.progress >= this.props.min ? 1 : 0)});

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        let showImg = (nextProps.progress >= nextProps.min ? 1 : 0);
        Animated.timing(prevState.fadeAnim, {
            toValue: showImg,
            duration: 300,
            delay: (nextProps.min - 1) * 1000
        }).start();
        return {showImg};

    }

    render() {
        let {assetUri} = this.props;
        let {fadeAnim} = this.state;

        let imgOpacityStyle = {opacity: fadeAnim.interpolate({
                inputRange: [0,1],
                outputRange: [0, 1]
            })};

        let dotOpacityStyle = {opacity: fadeAnim.interpolate({
                inputRange: [0,1],
                outputRange: [1, 0]
            })};

        return (
            <Animated.View style={{flex: 1}}>
                <Animated.View
                    style={[{
                        width: 32,
                        height: 32,
                        borderRadius: 32 / 2,
                        margin: 5,
                        backgroundColor: '#cfcfcf'
                    },dotOpacityStyle]}
                />
                <Animated.Image
                    style={[{
                        flex: 1,
                        width: 32,
                        height: 32,
                        margin: 5,
                        position: 'absolute',
                    },imgOpacityStyle]}
                    resizeMode="contain"
                    source={assetUri()}
                />
            </Animated.View>
        )
    }
}

RenderProgressDot.propTypes = {
    progress: PropTypes.number,
    min: PropTypes.number,
    assetUri: PropTypes.func
}

class ChallengeProgressBar extends Component {



    state = {
        fillAnim: new Animated.Value(0)

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        console.log("animating ChallengeProgressBar!");
        let progressSteps = (nextProps.progress - 1);
        let progressFill = Math.max(0, ((nextProps.progress - 1) / 3));

        Animated.timing(prevState.fillAnim, {
            toValue: progressFill,
            duration: progressSteps * 1000,

        }).start();
        return null;
    }


    makeProgressImages = (progress) => {
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'space-between',
                width: '100%',
            }}>
                <RenderProgressDot progress={progress} min={1} assetUri={() => {
                    return require("../../../assets/leaf_brown.png")
                }}/>
                <RenderProgressDot progress={progress} min={2} assetUri={() => {
                    return require("../../../assets/leaf_yellow.png")
                }}/>
                <RenderProgressDot progress={progress} min={3} assetUri={() => {
                    return require("../../../assets/leaf_green.png")
                }}/>
                <RenderProgressDot progress={progress} min={4} assetUri={() => {
                    return require("../../../assets/leaf_dark_green.png")
                }}/>
            </View>
        )
    };

    render() {
        let {progress} = this.props;
        let {fillAnim} = this.state;
       // progress = 2;
        let progressFill = Math.max(0, ((progress - 1) / 3) * 100);

        let animatedStyle = {width: fillAnim.interpolate({
                inputRange: [0,1],
                outputRange: ['0%', '100%']
            })};
        let progressImages = this.makeProgressImages(progress);
        console.debug(progress, progressFill + '%');
        return (
            <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginLeft: '10%',
                marginRight: '10%',
            }}>
                <View style={{
                    height: 32,
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    width: '30%'
                }}>
                    <View style={{
                        height: 5,

                        marginLeft: '12%',
                        marginRight: '15%'
                    }}>
                        <View style={{
                            backgroundColor: 'gray',
                            position: 'absolute',
                            width: '100%',
                            height: '100%'
                        }}/>
                        <Animated.View style={[{
                            backgroundColor: material.brandInfo,
                            position: 'absolute',

                            height: '100%'
                        }, animatedStyle]}/>
                    </View>
                    <View style={{
                        position: 'absolute',
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'space-between',
                    }}>
                        {progressImages}
                    </View>
                </View>
                <View style={{
                    marginLeft: '10%',
                }}>
                    <Button info rounded style={{height: 24, width: 24}}>
                        <Icon style={{width: 24, fontSize: 18}} name='md-help'/>
                    </Button>
                </View>
            </View>
        )
    }
}

ChallengeProgressBar.propTypes = {progress: PropTypes.number}

const styles = StyleSheet.create({
    ChallengesComponent: {
        flex: 3,
        margin: 10,
    },
    RenderThemenwocheComponent: {
        flex: 1,
        margin: 10,
    },
    Challenge: {
        margin: 10
    },
    ChallengeProgressIndicatorSegment: {
        margin: 2,
    },
    ChallengeProgressBarBar: {}
})