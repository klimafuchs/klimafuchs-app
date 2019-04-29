import React, {Component, Fragment} from 'react';
import {Body, Button, Container, Content, H3, Header, Icon, Left, Right, Text, Title} from 'native-base';
import {FlatList, Image, RefreshControl, StyleSheet, View} from 'react-native'
import * as Constants from "expo";
import {Query} from "react-apollo";
import {CURRENT_CHALLENGES, CURRENT_SEASONPLAN} from "../../network/Challenges.gql";
import material from "../../../native-base-theme/variables/material";
import {ChallengeDetailsModal} from "./ChallengeDetailsModal";
import * as PropTypes from "prop-types";

let refetchers = [];


export class SeasonPlanComponent extends Component {
    static navigationOptions = {
        title: 'Woche',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='star' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    challengeProgressIndicator;

    state = {
        refreshing: false
    };
    reload = () => {
        refetchers.map(refetch => {
            refetch()
        });
    }

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

                <ChallengeProgressIndicator challengeCompletions={[]} ref={ref => this.challengeProgressIndicator}/>

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
                                    style={{backgroundColor: '#f0f'}}
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

                <ChallengesComponent progressIndicator={this.challengeProgressIndicator}/>
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

class ChallengesComponent extends Component {
    render() {
        let {challengeProgressIndicator} = this.props;
        return (
            <Container style={styles.ChallengesComponent}>
                <Query query={CURRENT_CHALLENGES}>
                    {({loading, error, data, refetch}) => {
                        refetchers.push(refetch);

                        if (loading) return <Text>Loading...</Text>;
                        if (error) return <Text>Error {error.message}</Text>;
                        if (data.currentChallenges) {
                            const challenges = data.currentChallenges;
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
                        return (
                            <Text>no current challenges!</Text>
                        )

                    }}
                </Query>
            </Container>
        )
    }
}

class ChallengeButton extends Component {

    render() {
        let {challenge, refetch} = this.props;
        return (
            <View style={styles.Challenge}>

                <ChallengeDetailsModal
                    challenge={challenge}
                    refetch={refetch}
                    ref={(ref) => {
                        this.modal = ref
                    }}>

                    <Button block
                            light={!challenge.challengeCompletion}
                            primary={!!challenge.challengeCompletion}
                            onPress={() => this.modal.openModal()}>
                        <Text>{challenge.challenge.title}</Text>
                        {challenge.challengeCompletion &&
                        <Icon name="md-checkmark"/>
                        }
                    </Button>

                </ChallengeDetailsModal>

            </View>
        )
    }
}

class ChallengeProgressIndicator extends Component {
    render() {
        //TODO replace with something actually good and move to parent component for better layout options,
        // also steal overlaying layout code from FAB


        return (
            <Query query={CURRENT_CHALLENGES}>
                {({loading, error, data, refetch}) => {
                    refetchers.push(refetch);

                    if (loading) return <Text>Loading...</Text>;
                    if (error) return <Text>Error {error.message}</Text>;
                    if (data.currentChallenges) {

                        const challenges = data.currentChallenges;

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
                    return (
                        <Text>no current challenges!</Text>
                    )

                }}
            </Query>

        )
    }
}

ChallengeProgressIndicator.propTypes = {challengeCompletions: PropTypes.any}

class ChallengeProgressBar extends Component {
    makeProgressImages = (progress) => {
        return (
            <Fragment>
                <Image
                    style={{
                        flex: 1,
                        width: 32,
                        height: 32,
                        margin: 5,
                    }}
                    resizeMode="contain"
                    source={require('../../../assets/leaf_brown.png')}
                />
                <Image
                    style={{
                        flex: 1,
                        width: 32,
                        height: 32,
                        margin: 5,
                    }}
                    resizeMode="contain"
                    source={require('../../../assets/leaf_yellow.png')}
                />
                <Image
                    style={{
                        flex: 1,
                        width: 32,
                        height: 32,
                        margin: 5,
                    }}
                    resizeMode="contain"
                    source={require('../../../assets/leaf_green.png')}
                />
                <Image
                    style={{
                        flex: 1,
                        width: 32,
                        height: 32,
                        margin: 5,
                    }}
                    resizeMode="contain"
                    source={require('../../../assets/leaf_dark_green.png')}
                />
            </Fragment>
        )
    };

    render() {
        let {progress} = this.props;
        progress = 0
        let progressFill = Math.max(0, ((progress - 1) / 3) * 100);
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
                        marginRight: '12%'
                    }}>
                        <View style={{
                            backgroundColor: 'gray',
                            position: 'absolute',
                            width: '100%',
                            height: '100%'
                        }}/>
                        <View style={{
                            backgroundColor: material.brandInfo,
                            position: 'absolute',
                            width: `${progressFill}%`,
                            height: '100%'
                        }}/>
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