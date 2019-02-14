import React, {Component, Fragment} from "react";
import Modal from "react-native-modal";
import {Button, Card, CardItem, Form, H1, Input, Item, Label, Right, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {Mutation} from "react-apollo";
import {CREATE_TEAM} from "../../network/Teams.gql";
import {StyleSheet} from "react-native";
import UploadImage from "../UploadImage";

export class CreateTeamModal extends Component {
    state = {
        modalVisible: false,
        teamName: '',
        nameError: false,
        mediaId: undefined,
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
                                <Label style={styles.formLabel}>Name des Teams</Label>
                                <Item regular
                                      style={styles.teamNameInput}
                                      error={this.state.nameError}>
                                    <Input name="teamName"
                                           placeholder=""
                                           onChangeText={(text) => this.setState({email: text})}
                                           value={this.state.email}
                                           placeholderTextColor={material.brandInfo}/>
                                </Item>
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
                                                            .catch(err => console.log(err))
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
                <Button block
                        style={styles.ctaButton}
                        onPress={() => {
                            this.openModal();
                        }}>
                    <Text style={{color: material.tabBarTextColor}}>Team erstellen</Text>
                </Button>
            </Fragment>
        )
    }
}


const styles = StyleSheet.create({
    ctaButton: {
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 9,
        marginLeft: '20%',
        marginRight: '20%',
    },
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
