import React, {Component, Fragment} from "react";
import Modal from "react-native-modal";
import {Button, Card, CardItem, Form, H1, Right, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {Mutation} from "react-apollo";
import {CREATE_TEAM} from "../../network/Teams.gql";
import {StyleSheet} from "react-native";
import UploadImage from "../Common/UploadImage";
import PropTypes from 'prop-types';
import {ValidatingTextField} from "../Common/ValidatingTextInput";

export class CreateTeamModal extends Component {
    static propTypes = {
        children: PropTypes.element.isRequired,
    };

    state = {
        modalVisible: false,
        teamName: '',
        teamNameInput: undefined,
        nameError: '',
        mediaId: undefined,
        showErrors: false
    };


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
                    <Card style={{
                        margin: '10%',
                        flex: 1,
                        justifyContent: 'space-between',
                        alignItems: 'stretch'
                    }}>
                        <CardItem header style={{backgroundColor: material.brandPrimary}}>
                            <H1>Team erstellen</H1>
                        </CardItem>

                        <CardItem>
                            <Form style={{flex: 1, alignItems: 'stretch'}}>
                                <ValidatingTextField
                                    name='teamName'
                                    validateAs='teamName'
                                    label='Name des Teams'
                                    onChangeText={(text) => this.setState({teamName: text})}
                                    value={this.state.teamName}
                                    showErrors={this.state.showErrors}
                                    externalError={this.state.nameError}
                                    ref={(ref) => this.teamNameInput = ref}
                                />
                            </Form>
                        </CardItem>

                        <CardItem>
                            <UploadImage onUploadFinished={(media) => this.setState({mediaId: media.id})}/>
                        </CardItem>

                        <CardItem footer>
                            <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Button transparent onPress={() => this.closeModal()}>
                                    <Text>Abbrechen</Text>
                                </Button>
                                <Mutation mutation={CREATE_TEAM} errorPolicy="all">
                                    {(createTeam) => {
                                        return (
                                            <Button transparent
                                                    onPress={() => {
                                                        this.setState({showErrors: true});
                                                        let validationError = this.teamNameInput.getErrors();
                                                        console.log(validationError);
                                                        if (validationError) {
                                                            console.log(validationError);
                                                            return
                                                        }
                                                        createTeam({
                                                            variables: {
                                                                name: this.state.teamName,
                                                                avatarId: this.state.mediaId
                                                            }
                                                        })
                                                            .then((res) => {
                                                                this.closeModal();
                                                                if (this.props.onComplete) this.props.onComplete(res);
                                                            })
                                                            .catch(err => {
                                                                console.log(err.message);
                                                                this.setState({nameError: err.message})
                                                            })
                                                    }}>
                                                <Text>Weiter</Text>
                                            </Button>
                                        )
                                    }}
                                </Mutation>
                            </Right>
                        </CardItem>
                    </Card>
                </Modal>
                {this.props.children}
            </Fragment>
        )
    }
}


const styles = StyleSheet.create({
    modal: {
        backgroundColor: 'rgba(0,0,0,0)',
        margin: '5%',
    },
    teamNameInput: {
        backgroundColor: 'rgba(255, 255, 255, .8)',
        margin: 10,
        color: material.textColor,
        borderColor: material.brandInfo,
        marginBottom: 20
    },
    formLabel: {
        color: material.textColor,
        fontSize: 12,
        marginBottom: 5
    },
});

const validation = {
    teamName: {
        presence: {
            message: '^Bitte gib deinem Team einen Namen'
        },
    },
};

export default validation