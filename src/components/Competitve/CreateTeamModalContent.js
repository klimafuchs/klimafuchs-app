import React from "react";
import {Button, Card, CardItem, Form, H1, Right, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {Mutation} from "react-apollo";
import {CREATE_TEAM} from "../../network/Teams.gql";
import UploadImage from "../Common/UploadImage";
import {ValidatingTextField} from "../Common/ValidatingTextInput";
import {FSModalContentBase} from "../Common/FSModal";
import PropTypes from 'prop-types';


export class CreateTeamModalContent extends FSModalContentBase {
    static propTypes = {
        onComplete: PropTypes.func.isRequired
    };

    state = {
        teamName: '',
        teamNameInput: undefined,
        nameError: '',
        mediaId: undefined,
        showErrors: false
    };

    render() {
        let {requestModalClose, onComplete} = this.props;
        return (
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
                        <Button transparent onPress={() => requestModalClose()}>
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
                                                        requestModalClose();
                                                        onComplete(res);
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
        )
    };
}