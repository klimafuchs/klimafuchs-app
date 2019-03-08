import React, {Component} from 'react';
import {Body, Button, Container, H3, Header, Icon, Left, Right, Text, Title} from 'native-base';
import {FlatList, StyleSheet, View} from 'react-native'
import * as Constants from "expo";
import {Query} from "react-apollo";
import {CURRENT_CHALLENGES, CURRENT_SEASONPLAN} from "../../network/Challenges.gql";
import material from "../../../native-base-theme/variables/material";
import {ChallengeDetailsModal} from "./ChallengeDetailsModal";

export class SeasonPlanComponent extends Component {
    static navigationOptions = {
        title: 'Woche',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='star' style={{fontSize: 20, color: tintColor}}/>
        ),
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
                <Query query={CURRENT_SEASONPLAN}>
                    {({loading, error, data, refetch}) => {
                        if (loading) return <Text>Loading...</Text>;
                        if (error) return <Text>Error {error.message}</Text>;
                        if (data.globalCurrentChallenges) {
                            const themenwoche = data.globalCurrentChallenges.themenwoche;
                            return <RenderThemenwocheComponent themenwoche={themenwoche}/>
                        }
                        return (
                            <Text>no current challenges!</Text>
                        )
                    }}
                </Query>

                <ChallengesComponent/>
            </Container>
        );
    }
}

RenderThemenwocheComponent = ({themenwoche}) => {
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
        return (
            <Container style={styles.ChallengesComponent}>
                <Query query={CURRENT_CHALLENGES}>
                    {({loading, error, data, refetch}) => {
                        if (loading) return <Text>Loading...</Text>;
                        if (error) return <Text>Error {error.message}</Text>;
                        if (data.currentChallenges) {
                            const challenges = data.currentChallenges;
                            console.log(challenges)
                            return (
                                <View style={{flex: 1}}>
                                    <ChallengeProgressIndicator challenges={challenges}/>
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
                    ref={(ref) => {this.modal = ref}}>

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

const ChallengeProgressIndicator = ({challenges}) => {
    //TODO replace with something actually good and move to parent component for better layout options,
    // also steal overlaying layout code from FAB
    return (
        <View style={{height: 32}}>
            <View style={{flex: 1, flexDirection: 'row'}}>
                <Icon style={styles.ChallengeProgressIndicatorSegment}
                      name={challenges[0].challengeCompletion ? "md-square" : "md-square-outline"}/>
                <Icon style={styles.ChallengeProgressIndicatorSegment}
                      name={challenges[1].challengeCompletion ? "md-square" : "md-square-outline"}/>
                <Icon style={styles.ChallengeProgressIndicatorSegment}
                      name={challenges[2].challengeCompletion ? "md-square" : "md-square-outline"}/>
                <Icon style={styles.ChallengeProgressIndicatorSegment}
                      name={challenges[3].challengeCompletion ? "md-square" : "md-square-outline"}/>
            </View>
        </View>
    )
};

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
    }
})