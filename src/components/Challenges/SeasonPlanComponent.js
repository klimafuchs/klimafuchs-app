import React, {Component, Fragment} from 'react';
import {
    Body,
    Button,
    Container,
    Content,
    H3,
    Header,
    Icon,
    Left,
    Right,
    Text,
    Title,
    Card,
    CardItem,
    Spinner
} from 'native-base';
import {Animated, Easing, TouchableOpacity, FlatList, Image, RefreshControl, StyleSheet, View} from 'react-native'
import * as Constants from "expo";
import {Query} from "react-apollo";
import {CURRENT_CHALLENGES, CURRENT_SEASONPLAN} from "../../network/Challenges.gql";
import material from "../../../native-base-theme/variables/material";
import {ChallengeDetailsModal, ChallengeDetailsModalContent} from "./ChallengeDetailsModalContent";
import * as PropTypes from "prop-types";
import {FSModal} from "../Common/FSModal";
import {CreateTeamScreen} from "../Competitve/CreateTeamScreen";
import {LocalizationProvider as L} from "../../localization/LocalizationProvider";
import {MaterialDialog} from "react-native-material-dialog";

export class SeasonPlanComponent extends Component {
    static navigationOptions = {
        title: 'Woche',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='star' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    state = {
        refreshing: false,
        modalOpen: false,
        refetchers: []
    };

    notifyModalChange = (newModalOpen) => {
        this.setState({modalOpen: newModalOpen});
    };

    reload = () => {
        this.setState({refreshing: true});
        this.state.refetchers.map(refetch => {
            refetch()
        });
        this.setState({refreshing: false});

    }

    renderCurrentTopic = () => {
        return (
            <Query query={CURRENT_SEASONPLAN}>
                {({loading, error, data, refetch}) => {
                    this.state.refetchers.push(refetch);
                    if (loading) return (
                        <Container>
                            <Spinner/>
                        </Container>
                    );
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
                <Content refreshControl={<RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={() => this.reload()}
                    />}
                >
                    <Query query={CURRENT_CHALLENGES}>
                        {({loading, error, data, refetch}) => {
                            this.state.refetchers.push(refetch);

                            if (loading) return (
                                <Container>
                                    <Spinner/>
                                </Container>
                            );
                            if (error) return <Text>Error {error.message}</Text>;
                            if (data.currentChallenges) {
                                const challenges = data.currentChallenges;
                                console.log(challenges.map(c => {return c.replaceable}));
                                return (
                                    <Fragment>
                                        <ChallengeProgressIndicator challenges={challenges} shouldUpdate={!this.state.modalOpen}/>
                                        <View style={{
                                            flex: 1,
                                            margin: 10,
                                        }}>

                                            {this.renderCurrentTopic()}
                                        </View>
                                        <View style={{
                                            flex: 3,
                                            margin: 10,
                                        }}>

                                            <ChallengesComponent challenges={challenges} refetch={refetch} modalNotify={this.notifyModalChange}/>
                                        </View>
                                    </Fragment>
                                )
                            } else {
                                return (<Text>ERR</Text>)
                            }
                        }}
                    </Query>
                </Content>
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
            <Text style={{color: material.textLight}}>{themenwoche.content}</Text>
        </View>
    )
};

const ChallengesComponent = (props) => {
    let {challenges, refetch, modalNotify} = props;
    return (
        <View style={{flex: 1}}>
            <FlatList
                data={challenges}
                keyExtractor={(item, index) => item.id.toString()}
                renderItem={({item}) => {
                    return <ChallengePreview key={item.id} challenge={item} refetch={refetch} modalNotify={modalNotify}/>
                }
                }
            />
        </View>
    )
}

class ChallengePreview extends Component {

    render() {
        let {challenge, refetch, modalNotify} = this.props;
        return (
            <View style={styles.Challenge}>
                <FSModal
                    ref={(ref) => {
                        this.challengeModal = ref;
                    }}
                    body={<ChallengeDetailsModalContent
                        userChallenge={challenge}
                        refetch={refetch}
                        modalNotify={modalNotify}
                        requestModalClose={() => {
                            this.challengeModal.closeModal();
                            modalNotify(false);

                        }}/>}
                >
                    <Card>
                        <CardItem button onPress={() => {
                            this.challengeModal.openModal();
                            modalNotify(true);
                        }}>
                            <Body style={{flex: 3, flexDirection: 'column',}}>
                                <Text style={{
                                    fontSize: 12,
                                    marginBottom: 5,
                                    color: material.textLight
                                }}> {`${L.get('season')} 1 ${L.get('week')} ${challenge.plan.position}`}</Text>

                                <H3>{challenge.challenge.title}</H3>
                                <Body style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    marginTop: 2,
                                    width: '100%'
                                }}>
                                    <Icon name="md-arrow-dropright" size={5}
                                          style={{fontSize: 20, marginRight: 10, color: 'gray'}}/>
                                    <Text style={{fontSize: 12, color: material.textLight}}>
                                        {challenge.challenge.content.length > 40
                                            ? `${challenge.challenge.content.substr(0, 40)}...`
                                            : challenge.challenge.content}
                                    </Text>
                                </Body>
                            </Body>
                            <Right>
                                {challenge.challengeCompletion ?
                                    <Icon name='md-checkbox-outline'
                                          style={{fontSize: 30, color: material.brandPrimary}}/>
                                    :
                                    <Icon name='md-square-outline' style={{fontSize: 30, color: '#c7c7c7'}}/>
                                }
                            </Right>
                        </CardItem>
                    </Card>
                </FSModal>
            </View>
        )
    }
}

class ChallengeProgressIndicator extends Component {
    state = {
        oldChallenges: null,
        shouldUpdate: true
    };


    static getDerivedStateFromProps(nextProps, prevState) {
        if (!prevState.oldChallenges)
            return {oldChallenges: nextProps.challenges, shouldUpdate: nextProps.shouldUpdate};
        else if(nextProps.shouldUpdate){
            return {oldChallenges: nextProps.challenges, shouldUpdate: nextProps.shouldUpdate};
        } else {
            return {shouldUpdate: nextProps.shouldUpdate};
        }
    }


    render() {
        //TODO replace with something actually good and move to parent component for better layout options,
        // also steal overlaying layout code from FAB

        const {challenges, shouldUpdate} = this.props;
        const challengeCompletions = shouldUpdate ? challenges.map(challenge => challenge.challengeCompletion).filter(Boolean) : this.state.oldChallenges.map(challenge => challenge.challengeCompletion).filter(Boolean);
        return (
            <View style={{
                height: 48,
                padding: 10,
                marginTop: 10,
                marginBottom: 10,
            }}>
                <ChallengeProgressBar progress={challengeCompletions.length}/>
            </View>
        )
    }
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

        let imgOpacityStyle = {
            opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1]
            })
        };

        let dotOpacityStyle = {
            opacity: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0]
            })
        };

        return (
            <Animated.View style={{flex: 1}}>
                <Animated.View
                    style={[{
                        width: 32,
                        height: 32,
                        borderRadius: 32 / 2,
                        margin: 5,
                        backgroundColor: '#cfcfcf'
                    }, dotOpacityStyle]}
                />
                <Animated.Image
                    style={[{
                        flex: 1,
                        width: 32,
                        height: 32,
                        margin: 5,
                        position: 'absolute',
                    }, imgOpacityStyle]}
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
        fillAnim: new Animated.Value(0),
        showHint: false
    };

    static getDerivedStateFromProps(nextProps, prevState) {
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

        let animatedStyle = {
            width: fillAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
            })
        };
        let progressImages = this.makeProgressImages(progress);
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
                        height: 3,

                        marginLeft: '10%',
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
                    marginLeft: '5%',
                }}>


                    <TouchableOpacity style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'darkgray',
                        height: 24,
                        width: 24,
                        borderRadius: 24 / 2,
                        marginTop: 2,
                        marginBottom: 2,

                    }} onPress={() => {
                        this.setState({showHint: true})
                    }}
                    >
                        <Icon style={{color: '#404040'}} name='md-information-circle'/>
                        <MaterialDialog
                            title={L.get('hint_seasonplan_progress_title')}
                            visible={this.state.showHint}
                            cancelLabel=''
                            onCancel={() => {
                                this.setState({showHint: false})
                            }}
                            okLabel={L.get('okay')}
                            onOk={() => {
                                this.setState({showHint: false})
                            }}
                            colorAccent={material.textLight}
                        >

                        <Text>
                            {L.get("hint_seasonplan_progress")}
                        </Text>
                    </MaterialDialog>
                </TouchableOpacity>
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
});