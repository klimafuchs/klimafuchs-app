import React, {Component, Fragment} from 'react';
import {AsyncStorage, Switch, View} from 'react-native';
import {
    ActionSheet,
    Body,
    Button,
    Container,
    Content,
    Header,
    Icon,
    Input,
    Left,
    List,
    ListItem,
    Right,
    Spinner,
    Text,
    Title
} from "native-base";
import UploadImage from "../Common/UploadImage";
import PropTypes from "prop-types"
import material from "../../../native-base-theme/variables/material";
import {Mutation, Query} from "react-apollo";
import {CURRENT_USER, UPDATE_PROFILE} from "../../network/UserData.gql";
import {Util} from "../../util";

class ProfileScreen extends Component {

    static navigationOptions = {
        title: 'Profile',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-person' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    overflowActionsConfig = {
        config:
            {
                options: [
                    {text: "Abmelden", icon: "md-alert", iconColor: "#fa213b"},
                    {text: "Abbrechen", icon: "close", iconColor: "#25de5b"}
                ],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
                title: "Profil Aktionen"
            },
        callback: (buttonIndex) => {
            this.overflowActionsConfig.actions[buttonIndex]();
            this.actionSheetAction({
                index: buttonIndex,
                pressed: this.overflowActionsConfig.config.options[buttonIndex]
            });
        },
        actions: [
            () => {
                this._signOutAsync().catch(err => {
                    console.log(err)
                })
            },
            () => {
                console.log("action cancelled")
            },

        ],
    };

    actionSheetAction(param) {
        this.overflowActionsConfig.actions[param.index]();
    }

    constructor(props) {
        super(props);
    }

    _signOutAsync = async () => {
        await AsyncStorage.removeItem('uId');
        await AsyncStorage.removeItem('token');
        console.log("signed out");
        this.props.navigation.navigate('Auth');
    };

    render() {
        return (
            <Container>
                <Header>
                    <Left/>
                    <Body>
                    <Title>
                        <Text style={{color: '#fff'}}>Profil</Text>
                    </Title>
                    </Body>
                    <Right>
                        <Button transparent onPress={() => {
                            ActionSheet.show(
                                this.overflowActionsConfig.config,
                                this.overflowActionsConfig.callback
                            )
                        }}>
                            <Icon name='md-more'/>
                        </Button>
                    </Right>
                </Header>
                <Content padder style={{flex: 1}}>
                    <Query query={CURRENT_USER}>
                        {({data, loading, error, refetch}) => {
                            if (loading) return <Spinner/>;
                            if (error) return <Text>{error}</Text>;
                            let {userName, screenName, avatar} = data.getCurrentUser;
                            console.log(userName, screenName, avatar)
                            return (
                                <Fragment>
                                    <View style={{flex: 1, alignItems: 'center'}}>
                                        <Mutation mutation={UPDATE_PROFILE}>
                                            {(updateProfile, data, error) => {
                                                return (
                                                    <View style={{width: 200, height: 200, marginBottom: 50}}>
                                                        <UploadImage placeholder={Util.AvatarToUri(avatar)}
                                                                     onUploadFinished={(media) => {
                                                                         console.log(media);
                                                                         updateProfile({
                                                                             variables: {
                                                                                 avatarId: media.id
                                                                             }
                                                                         }).then(() => {
                                                                             refetch();
                                                                         }).catch((err) => console.log(err))
                                                                     }}/>

                                                        <Text>Profilbild ändern</Text>
                                                    </View>
                                                )
                                            }}
                                        </Mutation>
                                    </View>
                                    <List>
                                        <SettingsField value={userName}
                                                       hint="email"
                                                       field="userName"
                                                       onValueChanged={(newValue) => console.log("emai changed to " + newValue)}
                                        />
                                        <SettingsField value={screenName}
                                                       hint="screenname"
                                                       field="screenName"
                                                       onValueChanged={(newValue) => console.log("emai changed to " + newValue)}
                                        />

                                        <PasswordSetting value="<hidden>"
                                                         hint="password"
                                                         field="password"
                                                         onValueChanged={(newValue) => console.log("emai changed to " + newValue)}
                                        />

                                        <ListItem itemDivider style={{backgroundColor: 'rgba(0,0,0,0)'}}/>

                                        <ListItem>
                                            <Body>
                                            <Text>Benachrichtigungen</Text>
                                            </Body>
                                            <Right>
                                                <Switch/>
                                            </Right>
                                        </ListItem>
                                    </List>
                                </Fragment>
                            )
                        }}
                    </Query>

                </Content>
            </Container>


        );
    };
}

class SettingsField extends Component {

    static propTypes = {
        value: PropTypes.string.isRequired,
        field: PropTypes.string.isRequired,
        hint: PropTypes.string.isRequired,
        onValueChanged: PropTypes.func.isRequired
    };

    state = {
        isEditing: false,
        newValue: this.props.value
    };

    cancelEdit = () => {
        this.setState({isEditing: false, newValue: this.props.value})
    };
    onSubmit = (mutate) => {
        this.setState({isEditing: false})
        this.props.onValueChanged(this.state.newValue);
    }

    contentNotEditing = (value, hint) => {
        return (
            <ListItem>
                <Body>
                <Text>{value}</Text>
                <Text note>{hint}</Text>
                </Body>
                <Right>
                    <Button transparent dark onPress={() => this.setState({isEditing: true})}>
                        <Icon name="md-create"/>
                    </Button>
                </Right>
            </ListItem>
        )
    };

    contentEditing = (value, hint, onValueChanged) => {
        return (
            <ListItem>
                <Body>
                <Input name="hint"
                       placeholder={hint}
                       onChangeText={(text) => this.setState({newValue: text})}
                       value={this.state.newValue}
                       placeholderTextColor={material.brandDark}
                       onBlur={this.cancelEdit}
                       onSubmitEditing={this.onSubmit}
                />
                </Body>
                <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                    <Button transparent dark onPress={this.onSubmit}>
                        <Icon name="md-create"/>
                    </Button>
                    <Button transparent dark onPress={this.cancelEdit}>
                        <Icon name="close"/>
                    </Button>
                </Right>
            </ListItem>
        )
    };


    render() {
        let {value, hint, onValueChanged} = this.props;
        let {isEditing} = this.state;
        let content = isEditing ? this.contentEditing(value, hint, onValueChanged) : this.contentNotEditing(value, hint)
        return (
            <Fragment>
                {content}
            </Fragment>
        )
    }
}

class PasswordSetting extends SettingsField {

    state = {
        isEditing: false,
        newPassword: '',
        oldPassword: '',
    };


    contentEditing = (value, hint, onValueChanged) => {
        return (
            <Fragment>
                <ListItem>
                    <Body>
                    <Input name="oldPassword"
                           placeholder={hint}
                           onChangeText={(text) => this.setState({newValue: text})}
                           value={this.state.newValue}
                           placeholderTextColor={material.brandDark}
                           onBlur={this.cancelEdit}
                           onSubmitEditing={this.onSubmit}
                    />
                    </Body>
                    <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                        <Button transparent dark onPress={this.onSubmit}>
                            <Icon name="md-create"/>
                        </Button>
                        <Button transparent dark onPress={this.cancelEdit}>
                            <Icon name="close"/>
                        </Button>
                    </Right>
                </ListItem>
                <ListItem>
                    <Body>
                    <Input name="newPassword"
                           placeholder={hint}
                           onChangeText={(text) => this.setState({newValue: text})}
                           value={this.state.newValue}
                           placeholderTextColor={material.brandDark}
                           onBlur={this.cancelEdit}
                           onSubmitEditing={this.onSubmit}
                    />
                    </Body>
                </ListItem>
                <ListItem>
                    <Body>
                    <Input name="confirmNewPassword"
                           placeholder={hint}
                           onChangeText={(text) => this.setState({newValue: text})}
                           value={this.state.newValue}
                           placeholderTextColor={material.brandDark}
                           onBlur={this.cancelEdit}
                           onSubmitEditing={this.onSubmit}
                    />
                    </Body>
                </ListItem>
            </Fragment>
        )
    };
}

export default ProfileScreen;
