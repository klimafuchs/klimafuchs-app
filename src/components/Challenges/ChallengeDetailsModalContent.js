import React, {Component, Fragment} from 'react';
import {ImageBackground, StyleSheet, View, Switch} from 'react-native'
import Modal from "react-native-modal";
import {Button, Content, Container, Card, CardItem, H1, H3, Icon, Right, Body, Left, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {Mutation} from "react-apollo";
import PropTypes from 'prop-types';
import {COMPLETE_CHALLENGE, UNCOMPLETE_CHALLENGE} from "../../network/Challenges.gql";
import {LocalizationProvider as L} from "../../localization/LocalizationProvider";
import {FSModalContentBase} from "../Common/FSModal";

export class ChallengeDetailsModalContent extends FSModalContentBase {
    state = {
        loading: false
    };

    getCompletionActionButton = (challengeTitle, challengeCompletion, targetId, refetch, modalNotify) => {
        if (challengeCompletion) {
            return (
                <Mutation mutation={UNCOMPLETE_CHALLENGE}>
                {(uncompleteChallenge, {loading, error}) => (

                    <View>
                        <Switch
                            value={true}
                            disabled={loading}
                            onValueChange={async () => {
                                    console.log("!")
                                    await uncompleteChallenge({
                                        variables: {
                                            challengeCompletionId: challengeCompletion.id
                                        }
                                    });
                                    modalNotify(false);
                                    refetch()
                                }}/>
                    </View>
                )}
            </Mutation>
            )
        } else {
            return (
                <Mutation mutation={COMPLETE_CHALLENGE}>
                {(completeChallenge, {loading, error}) => (

                    <View>
                        <Switch

                            value={false}
                            disabled={loading}

                            onValueChange={async () => {
                                    console.log("?")

                                    await completeChallenge({
                                        variables: {
                                            challengeId: targetId
                                        }
                                    });
                                    refetch()
                                }}/>
                    </View>
                )}
            </Mutation>
            )
        }
    };

    render() {
        let {userChallenge, refetch, requestModalClose, modalNotify} = this.props;
        const targetId = userChallenge.id;
        const challengeCompletion = userChallenge.challengeCompletion;
        let challenge = userChallenge.challenge;
        return (
            <Card style={{
                margin: '10%',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'stretch'
            }}>
                <View header style={{backgroundColor: material.brandInfo, flex: 2}}>
                    <ImageBackground source={challenge.headerImage ? {uri: challenge.headerImage.url} : require('../../../assets/asset_missing.png')} style={{width: '100%', height: '100%'}}>
                        <View>
                            <Button transparent info onPress={() => {
                                requestModalClose();
                            }}>
                                <Icon style={{fontSize: 30, color: material.textLight}}name="md-close"/>
                            </Button>
                        </View>
                    </ImageBackground>
                </View>
                <CardItem style={{flex:3, flexDirection: 'column',alignItems: 'stretch'}}>
                    <View style={{flex:1, flexDirection: 'column', alignItems: 'flex-end'}}>
                    {this.getCompletionActionButton(challenge.title, challengeCompletion, targetId, refetch, modalNotify)}
                    </View>
                    <H3 style={{flex:2}}>
                        {challenge.title}
                    </H3>
                    <Container  style={{flex:6}}>
                    <Content>
                        <Text style={{ color: material.textLight}}>
                            {challenge.content}
                        </Text>
                    </Content>
                    </Container>
                </CardItem>

                <CardItem footer>
                    <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Button transparent onPress={() => {
                            requestModalClose();
                        }}>
                            <Text style={{color: material.textLight}}>{L.get('reject_challenge')}</Text>
                        </Button>
                    </Right>

                    <Left style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Button transparent onPress={() => {
                            requestModalClose();
                        }}>
                            <Text style={{color: material.textLight}}>{L.get('okay')}</Text>
                        </Button>
                    </Left>
                </CardItem>
            </Card>
        )
    }
}

ChallengeDetailsModalContent.propTypes = {
    userChallenge: PropTypes.any,
    challengeCompletion: PropTypes.any,
    targetId: PropTypes.any,
    refetch: PropTypes.any,
    closeModal: PropTypes.any
}

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0,0,0,0)',
        margin: '5%',
    },
});
