import React, {Component, Fragment} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Card, CardItem, Container, Form, H1, H3, Input, Item, Label, Right, Text} from "native-base";
import {CREATE_TEAM, MY_MEMBERSHIPS} from "../../network/Teams.gql";
import {Mutation, Query} from "react-apollo";
import material from "../../../native-base-theme/variables/material";
import Modal from "react-native-modal";
import UploadImage from "../UploadImage";


export class TeamsScreen extends Component {
    static navigationOptions = {
        title: 'Meine Teams',
    };

    renderTeamsGettingStarted = (refetch) => (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: '10%',
            marginRight: '10%',
            marginTop: '20%',
            marginBottom: '20%',
        }}>
            <Image
                style={{width: 100, height: 100, margin: 5}}
                resizeMode="contain"
                source={require('../../../assets/asset_missing.png')}
            />
            <H3 style={{marginBottom: '5%'}}>Du hast noch kein Team</H3>

            <CreateTeamModal onComplete={refetch}/>
            <Button block
                    style={styles.ctaButton}
                    onPress={() => {
                        this.props.navigation.navigate('Teams')
                    }}>
                <Text style={{color: material.tabBarTextColor}}>Team beitreten</Text>
            </Button>
        </View>
    );

    renderTeams = (memberships) => (
        <Text>teams exist</Text>
    );

    render() {
        return (
            <Container>
                <Query query={MY_MEMBERSHIPS}>
                    {({loading, error, data, refetch}) => {
                        if (loading) return <Text>Loading...</Text>;
                        if (error) return <Text>{error.message}</Text>;
                        if (data) {
                            if (data.myMemberships.length > 0) {
                                return this.renderTeams(data.myMemberships);
                            } else {
                                return this.renderTeamsGettingStarted(refetch)
                            }
                        }
                    }}
                </Query>
            </Container>
        );
    }

}

class CreateTeamModal extends Component {
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
