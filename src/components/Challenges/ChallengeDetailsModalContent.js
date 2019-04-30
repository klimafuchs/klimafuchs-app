import React, {Component, Fragment} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native'
import Modal from "react-native-modal";
import {Button, Card, CardItem, H1, Icon, Right, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {Mutation} from "react-apollo";
import PropTypes from 'prop-types';
import {COMPLETE_CHALLENGE} from "../../network/Challenges.gql";
import {LocalizationProvider as L} from "../../localization/LocalizationProvider";
import {FSModalContentBase} from "../Common/FSModal";

export class ChallengeDetailsModalContent extends FSModalContentBase {
    render() {
        let {userChallenge, refetch, requestModalClose} = this.props;
        const targetId = userChallenge.id;
        const challengeCompletion = userChallenge.challengeCompletion;
        let challenge = userChallenge.challenge;
        console.log("challenge title: " + JSON.stringify(challenge));
        const headerContent = challenge.headerImage ?
            <ImageBackground src={challenge.headerImage.url}>
                <H1>{challenge.challenge.title}</H1>
            </ImageBackground> : <H1>{challenge.title}</H1>;
        return (
            <Card style={{
                margin: '10%',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'stretch'
            }}>
                <CardItem header style={{backgroundColor: material.brandPrimary}}>
                    {headerContent}
                </CardItem>

                <CardItem>
                    <Text>
                        {challenge.content}
                    </Text>
                </CardItem>

                <CardItem footer>
                    <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Button transparent onPress={() => {
                            requestModalClose();
                        }}>
                            <Text>{L.get('cancel')}</Text>
                        </Button>
                        <Mutation mutation={COMPLETE_CHALLENGE}>
                            {(completeChallenge, {data}) => (

                                <View>
                                    <Button block
                                            light={!challengeCompletion}
                                            primary={!!challengeCompletion}
                                            disabled={!!challengeCompletion}
                                            onPress={async () => {
                                                await completeChallenge({
                                                    variables: {
                                                        challengeId: targetId
                                                    }
                                                });
                                                refetch()
                                            }}>
                                        <Text>{challenge.title}</Text>
                                        {challengeCompletion &&
                                        <Icon name="md-checkmark"/>
                                        }
                                    </Button>
                                </View>
                            )}
                        </Mutation>
                    </Right>
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
