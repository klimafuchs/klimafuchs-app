import React, {Component, Fragment} from 'react';
import {ImageBackground, StyleSheet, View, Switch, TouchableOpacity} from 'react-native'
import Modal from "react-native-modal";
import {Button, Content, Container, Card, CardItem, H1, H3, Icon, Right, Body, Left, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {Mutation} from "react-apollo";
import PropTypes from 'prop-types';
import {COMPLETE_CHALLENGE, REJECT_CHALLENGE, UNCOMPLETE_CHALLENGE} from "../../network/Challenges.gql";
import {LocalizationProvider as L} from "../../localization/LocalizationProvider";
import {FSModalContentBase} from "../Common/FSModal";
import {MaterialDialog} from "react-native-material-dialog";

export class ChallengeDetailsModalContent extends FSModalContentBase {
    state = {
        loading: false,
        optimisticResult: false,
        showRejectDialog: false,
    };

    static getDerivedStateFromProps(nextProps, prevState) {
        let {userChallenge} = nextProps;
        let {loading} = prevState;
        if (loading) return null;
        const challengeCompletion = userChallenge.challengeCompletion;
        return {optimisticResult: !!challengeCompletion};
    }

    getCompletionActionButton = (challengeTitle, challengeCompletion, targetId, refetch, modalNotify) => {
        if (challengeCompletion) {
            return (
                <Mutation mutation={UNCOMPLETE_CHALLENGE}>
                    {(uncompleteChallenge, {loading, error}) => (

                        <View>
                            <Switch
                                value={this.state.optimisticResult}
                                disabled={loading}
                                onValueChange={async () => {
                                    console.log("!")
                                    this.setState({loading: true, optimisticResult: false})
                                    await uncompleteChallenge({
                                        variables: {
                                            challengeCompletionId: challengeCompletion.id
                                        },
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

                                value={this.state.optimisticResult}
                                disabled={loading}

                                onValueChange={async () => {
                                    console.log("?")
                                    this.setState({loading: true, optimisticResult: true})

                                    await completeChallenge({
                                        variables: {
                                            challengeId: targetId
                                        },
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
        let {userChallenge, refetch, requestModalClose, modalNotify, jokerCount} = this.props;
        const targetId = userChallenge.id;
        const challengeCompletion = userChallenge.challengeCompletion;
        let challenge = userChallenge.challenge;
        console.log(userChallenge);
        return (
            <Card style={{
                margin: '10%',
                flex: 1,
                justifyContent: 'space-between',
                alignItems: 'stretch'
            }}>
                <View header style={{backgroundColor: material.brandInfo, flex: 2}}>
                    <ImageBackground
                        source={challenge.headerImage ? {uri: challenge.headerImage.url} : require('../../../assets/image_select.png')}
                        style={{width: '100%', height: '100%', backgroundColor: "#ff0"}}>
                        <View>
                            <Button transparent info onPress={() => {
                                requestModalClose();
                            }}>
                                <Icon style={{fontSize: 30, color: material.textLight}} name="md-close"/>
                            </Button>
                        </View>
                    </ImageBackground>
                </View>
                <CardItem style={{flex: 3, flexDirection: 'column', alignItems: 'stretch'}}>
                    <View style={{flex: 1, flexDirection: 'column', alignItems: 'flex-end'}}>
                        {this.getCompletionActionButton(challenge.title, challengeCompletion, targetId, refetch, modalNotify)}
                    </View>
                    <H3 style={{flex: 2}}>
                        {challenge.title}
                    </H3>
                    <Container style={{flex: 6}}>
                        <Content>
                            <Text style={{color: material.textLight}}>
                                {challenge.content}
                            </Text>
                        </Content>
                    </Container>
                </CardItem>

                <CardItem footer>
                    <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
                        <Button transparent disabled={!userChallenge.replaceable} onPress={() => {
                            this.setState({showRejectDialog: true});
                        }}>
                            <Mutation mutation={REJECT_CHALLENGE}>
                                {(rejectChallenge, {loading, error}) => {
                                    return (
                                        <Fragment>
                                            <Text style={{color: material.textLight}}>{L.get('reject_challenge')}</Text>
                                            <MaterialDialog
                                                title={L.get('hint_seasonplan_challenge_reject_title')}
                                                visible={this.state.showRejectDialog}
                                                cancelLabel={L.get('no')}
                                                onCancel={() => {
                                                    this.setState({showRejectDialog: false})
                                                }}
                                                okLabel={L.get('yes')}
                                                onOk={ async () => {
                                                    this.setState({showRejectDialog: false});
                                                    console.log("!!");
                                                    this.setState({loading: true, optimisticResult: true});

                                                    await rejectChallenge({
                                                        variables: {
                                                            challengeId: targetId
                                                        },
                                                    });
                                                    refetch()

                                                }}
                                                colorAccent={material.textLight}
                                            >

                                                <Text style={{color: material.textLight}}>
                                                    {L.get("hint_seasonplan_challenge_reject", {jokerCount: jokerCount})}
                                                </Text>
                                            </MaterialDialog>
                                        </Fragment>
                                    )
                                }}
                            </Mutation>

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
        backgroundColor: '#ff0000',
        margin: '5%',
    },
});
