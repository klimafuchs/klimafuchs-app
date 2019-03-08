import React, {Component, Fragment} from 'react';
import {ImageBackground, StyleSheet, View} from 'react-native'
import Modal from "react-native-modal";
import {Button, Card, CardItem, H1, Icon, Right, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {Mutation} from "react-apollo";
import PropTypes from 'prop-types';
import {COMPLETE_CHALLENGE} from "../../network/Challenges.gql";

export class ChallengeDetailsModal extends Component {

    static propTypes = {
        challenge: PropTypes.shape({
            challenge: PropTypes.shape({
                id: PropTypes.number.isRequired,
                title: PropTypes.string.isRequired,
                content: PropTypes.string.isRequired,
                headerImage: PropTypes.shape({
                    url: PropTypes.string.isRequired
                })
            }).isRequired,
            challengeCompletion: PropTypes.shape({
                id: PropTypes.number
            })
        }).isRequired

    };
    state = {
        modalVisible: false
    }
    closeModal = () => {
        this.setState({modalVisible: false})
    }
    openModal = () => {
        this.setState({modalVisible: true})
    }

    render() {
        return (
            <Fragment>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    style={styles.modal}
                    onRequestClose={() => {
                        this.closeModal()
                    }}>
                    <ChallengeDetailsComponent challenge={this.props.challenge.challenge}
                                               challengeCompletion={this.props.challenge.challengeCompletion}
                                               refetch={this.props.refetch} closeModal={this.closeModal}/>
                </Modal>
                {this.props.children}
            </Fragment>
        )
    }
}

const ChallengeDetailsComponent = ({challenge, challengeCompletion, refetch, closeModal}) => {
    console.log(challenge)
    const headerContent = challenge.headerImage ?
        <ImageBackground src={challenge.headerImage.url}>
            <H1>{challenge.title}</H1>
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
                    <Button transparent onPress={() => closeModal()}>
                        <Text>Abbrechen</Text>
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
                                                    challengeId: challenge.id
                                                }
                                            });
                                            refetch();
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

const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0,0,0,0)',
        margin: '5%',
    },
});
