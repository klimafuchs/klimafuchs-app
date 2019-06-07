import React, {Component} from 'react';
import {
    Body,
    Container,
    Content,
    Header,
    Left,
    Title,
    Text,
    Button,
    Icon,
    Card,
    CardItem,
    Form,
    Textarea, Label, Right
} from "native-base";
import {SafeAreaView} from "react-navigation";
import {StyleSheet, Switch, View} from "react-native";
import material from "../../../native-base-theme/variables/material";
import UploadImage from "../Common/UploadImage";
import {ValidatingTextField} from "../Common/ValidatingTextInput";
import {Mutation} from "react-apollo";
import {CREATE_TEAM, MOD_TEAM} from "../../network/Teams.gql";
import {Util} from "../../util";

export class EditTeamScreen extends Component {
    static navigationOptions = {
            headerMode: "none",
            mode: 'modal',
            header: null
    };

    state = {
        teamName: '',
        teamNameInput: undefined,
        nameError: '',
        mediaId: undefined,
        showErrors: false,
        teamDescription: '',
        isPrivate: false
    };

    render() {
        let {requestModalClose, onComplete, navigation} = this.props;
        const teamId = navigation.getParam('teamId', -1);
        console.debug(teamId)
        const {name, description, closed, avatar} = navigation.getParam('teamData', {});
        return (
            <SafeAreaView style={styles.container} forceInset={{top: 'always'}}>
                <Container>
                    <Header>

                        <Left>
                            <Button transparent onPress={() => {
                                this.props.navigation.navigate('MyTeams');
                            }}>
                                <Icon name='md-arrow-back'/>
                            </Button>
                        </Left>
                        <Body>
                            <Title>
                                Team bearbeiten
                            </Title>
                        </Body>
                    </Header>

                    <Content style={{flex: 1}}>


                        <Card transparent style={{
                            margin: '10%',
                            flex: 1,
                            justifyContent: 'space-between',
                            alignItems: 'stretch'
                        }}>

                            <CardItem style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}>
                                <View style={{height: 200, width: 200}}>
                                    <UploadImage placeholder={Util.AvatarToUri(avatar)} onUploadFinished={(media) => this.setState({mediaId: media.id})}/>
                                </View>
                            </CardItem>

                            <CardItem>
                                <Form style={{flex: 1, alignItems: 'stretch'}}>
                                    <ValidatingTextField
                                        name='teamName'
                                        validateAs='teamName'
                                        label='Name des Teams'
                                        onChangeText={(text) => this.setState({teamName: text})}
                                        value={this.state.teamName || name}
                                        showErrors={this.state.showErrors}
                                        externalError={this.state.nameError}
                                        ref={(ref) => this.teamNameInput = ref}
                                    />
                                </Form>
                            </CardItem>

                            <CardItem>
                                <Form style={{flex: 1, alignItems: 'stretch'}}>
                                    <Textarea rowSpan={5} bordered
                                              name='teamDescription'
                                              onChangeText={(text) => this.setState({teamDescription: text})}
                                              value={this.state.teamDescription || description} style={{
                                        borderColor: material.textColor,

                                    }}
                                    />
                                    <Label style={{

                                        color: material.textColor,
                                        fontSize: 12,
                                        marginBottom: 5
                                    }}>Team Beschreibung</Label>

                                </Form>
                            </CardItem>

                            <CardItem>

                                <Left>
                                    <Text>Geschlossene Gruppe</Text>
                                </Left>
                                <Right>
                                    <Switch value={this.state.isPrivate || closed} onValueChange={
                                        () => {
                                            this.setState({isPrivate: !this.state.isPrivate})
                                        }
                                    }/>
                                </Right>

                            </CardItem>

                            <CardItem footer>
                                <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                    <Button transparent onPress={() => this.props.navigation.navigate('Main')}>
                                        <Text>Abbrechen</Text>
                                    </Button>
                                    <Mutation mutation={MOD_TEAM} errorPolicy="all">
                                        {(updateTeam) => {
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
                                                            updateTeam({
                                                                variables: {
                                                                    id: teamId,
                                                                    name: this.state.teamName,
                                                                    description: this.state.teamDescription,
                                                                    avatarId: this.state.mediaId,
                                                                    closed: this.state.isPrivate

                                                                }
                                                            })
                                                                .then(({data}) => {
                                                                    this.props.navigation.navigate('Main')
                                                                })
                                                                .catch(err => {
                                                                    console.log(JSON.stringify(err, null, 4));
                                                                    this.setState({nameError: err.message})
                                                                })
                                                        }}>
                                                    <Text>Fertig</Text>
                                                </Button>
                                            )
                                        }}
                                    </Mutation>
                                </Right>
                            </CardItem>
                        </Card>


                    </Content>
                </Container>
            </SafeAreaView>)
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: material.brandInfo
    }
})