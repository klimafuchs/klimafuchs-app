import React, {Component, Fragment} from 'react';
import {AsyncStorage, Switch, View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-navigation'
import {
    ActionSheet,
    Body,
    Button,
    Container,
    Content,
    Header,
    Icon,
    Left,
    List,
    ListItem,
    Right,
    Spinner,
    Text,
    Title,
    Toast
} from "native-base";
import UploadImage from "../Common/UploadImage";
import PropTypes from "prop-types"
import {Mutation, Query} from "react-apollo";
import {CHANGE_PASSWORD, CURRENT_USER, UPDATE_PROFILE} from "../../network/UserData.gql";
import {Util} from "../../util";
import {ValidatingTextField} from "../Common/ValidatingTextInput";
import client from "../../network/client"
import material from "../../../native-base-theme/variables/material";

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
        await client.clearStore();
        console.log("signed out");
        this.props.navigation.navigate('Auth');
    };

    render() {
        return (
            <SafeAreaView style={styles.container} forceInset={{ top: 'always' }}>
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
                <Content style={{flex: 1}}>
                    <Query query={CURRENT_USER}>
                        {({data, loading, error, refetch}) => {
                            if (loading) return <Spinner/>;
                            if (error) return <Text>{error}</Text>;
                            let {userName, screenName, avatar} = data.getCurrentUser;
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
                                                       refetch={refetch}
                                                       onValueChanged={(newValue) => {
                                                           console.log("eMail changed to " + newValue)
                                                           Toast.show({
                                                               text: "eMail changed to " + newValue,
                                                               buttonText: 'Okay'
                                                           })
                                                       }}
                                        />
                                        <SettingsField value={screenName}
                                                       hint="screenName"
                                                       field="screenName"
                                                       refetch={refetch}
                                                       onValueChanged={(newValue) => {
                                                           console.log("screenName changed to " + newValue)
                                                           Toast.show({
                                                               text: "screenName changed to " + newValue,
                                                               buttonText: 'Okay'
                                                           })
                                                       }}
                                        />

                                        <PasswordSetting value="<hidden>"
                                                         hint="password"
                                                         field="password"
                                                         refetch={refetch}
                                                         onValueChanged={() => {
                                                             console.log("password changed");
                                                             Toast.show({
                                                                 text: "password changed",
                                                                 buttonText: 'Okay'
                                                             })
                                                         }}
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
            </SafeAreaView>

        );
    };
}

class SettingsField extends Component {

    static propTypes = {
        value: PropTypes.string.isRequired,
        field: PropTypes.string.isRequired,
        hint: PropTypes.string.isRequired,
        onValueChanged: PropTypes.func.isRequired,
        refetch: PropTypes.func.isRequired
    };

    state = {
        isEditing: false,
        newValue: this.props.value,
        error: "not changed",
    };

    cancelEdit = () => {
        this.setState({isEditing: false, newValue: this.props.value})
    };
    onSubmit = (mutate) => {
        this.setState({isEditing: false});
        this.props.refetch();
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

    contentEditing = (value, hint, onValueChanged, field) => {
        return (
            <Mutation mutation={UPDATE_PROFILE}>
                {(updateProfile, data, error) => {
                    return (

                        <ListItem>
                            <Body>

                            <ValidatingTextField
                                name={field}
                                validateAs={field}
                                label={hint}
                                onChangeText={(text) => this.setState({newValue: text, error: this.input.getErrors()})}
                                alwaysShowErrors
                                value={this.state.newValue}
                                ref={(ref) => this.input = ref}
                                onBlur={(error) => {
                                    this.setState({userNameError: error})
                                }}
                            />
                            </Body>
                            <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                <Button transparent dark disabled={!!this.state.error} onPress={() => {
                                    if (!this.input.getErrors()) {
                                        updateProfile({
                                            variables: {
                                                [this.props.field]: this.state.newValue
                                            }
                                        }).then(() => {
                                            this.onSubmit()
                                        })
                                    }
                                }}>
                                    <Icon name="md-create"/>
                                </Button>
                                <Button transparent dark onPress={this.cancelEdit}>
                                    <Icon name="close"/>
                                </Button>
                            </Right>
                        </ListItem>

                    )
                }}
            </Mutation>)
    };


    render() {
        let {value, hint, onValueChanged, field} = this.props;
        let {isEditing} = this.state;
        let content = isEditing ? this.contentEditing(value, hint, onValueChanged, field) : this.contentNotEditing(value, hint, field)
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
        password: '',
        password2: '',
        oldPassword: '',
        passwordError: "not changed",
        oldPasswordError: undefined,
    };

    checkPasswords = () => {
        let {password, password2} = this.state;
        if (password !== password2) {
            this.setState({passwordError: "Die Passwörter stimmen nicht überein"})
        }
    };

    contentEditing = (value, hint, onValueChanged) => {
        return (
            <Mutation mutation={CHANGE_PASSWORD}>
                {(changePassword, data, error) => {
                    return (
                        <Fragment>
                            <ListItem>
                                <Body>
                                <ValidatingTextField
                                    name='oldPassword'
                                    validateAs='password'
                                    label='oldPassword'
                                    secureTextEntry
                                    onChangeText={(text) => this.setState({oldPassword: text})}
                                    value={this.state.oldPassword}
                                    externalError={this.state.oldPasswordError}
                                    ref={(ref) => this.passwordInput = ref}
                                />
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                <ValidatingTextField
                                    name='password'
                                    validateAs='password'
                                    label='password'
                                    secureTextEntry
                                    onChangeText={(text) => this.setState({password: text})}
                                    value={this.state.password}
                                    externalError={this.state.passwordError}
                                    ref={(ref) => this.passwordInput = ref}
                                    onBlur={(error) => {
                                        this.setState({passwordError: error})
                                    }}
                                />
                                </Body>
                            </ListItem>

                            <ListItem>
                                <Body>
                                <ValidatingTextField
                                    name='password2'
                                    validateAs='password2'
                                    label='Passwort bestätigen'
                                    secureTextEntry
                                    onChangeText={(text) => this.setState({password2: text})}
                                    value={this.state.password2}
                                    externalError={this.state.passwordError}
                                    ref={(ref) => this.password2Input = ref}
                                    onBlur={(error) => {
                                        this.checkPasswords();
                                    }}
                                />
                                </Body>
                            </ListItem>
                            <ListItem>
                                <Body>
                                </Body>
                                <Right style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                                    <Button transparent disabled={!!this.state.passwordError} dark onPress={() => {
                                        if (!this.state.passwordError) {
                                            changePassword({
                                                variables: {
                                                    oldPassword: this.state.oldPassword,
                                                    newPassword: this.state.password
                                                }
                                            }).then(() => {
                                                this.onSubmit()
                                            }).catch((err) => console.log(err))
                                        }
                                    }}>
                                        <Icon name="md-create"/>
                                    </Button>
                                    <Button transparent dark onPress={this.cancelEdit}>
                                        <Icon name="close"/>
                                    </Button>
                                </Right>
                            </ListItem>
                        </Fragment>
                    )
                }}

            </Mutation>
        )
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: material.brandInfo
    }
})
export default ProfileScreen;
