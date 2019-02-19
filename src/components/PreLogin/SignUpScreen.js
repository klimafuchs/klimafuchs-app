import React, {Component, Fragment} from 'react';
import {AsyncStorage, KeyboardAvoidingView, StyleSheet} from 'react-native'
import {Body, Button, Container, Content, Form, Header, Icon, Left, Right, Title} from "native-base";
import Api from "../../network/api";
import material from '../../../native-base-theme/variables/material';
import {ValidatingTextField} from "../Common/ValidatingTextInput";

class SignUpScreen extends Component {
    state = {
        userName: '',
        screenName: '',
        password: '',
        password2: '',
        gdprAccept: false,
        newsLetterAccept: false,
        invite: '',

        screenNameError: '',
        userNameError: '',
        passwordError: '',
    };


    checkPasswords = () => {
        let {password, password2} = this.state;
        if (password !== password2) {
            this.setState({passwordError: "Die Passwörter stimmen nicht überein"})
        }
    };

    register = async () => {
        this.checkPasswords();
        if (!!(this.state.screenNameError || this.state.userNameError || this.state.passwordError)) return;
        let {screenName, userName, password, password2, gdprAccept, newsLetterAccept, invite} = this.state;
        Api.register({
                screenname: screenName,
                username: userName,
                password: password,
                confirm_password: password2,
                invite: invite
            },
            async (res) => {
                console.log(res.data);
                if (res.status === 200) {
                    Api.login(this.state.userName,
                        this.state.password,
                        async (res) => {
                            console.log(res.data);
                            if (res.status === 200) {
                                await AsyncStorage.setItem('uId', res.data.id.toString());
                                await AsyncStorage.setItem('token', res.data.token);
                                this.props.navigation.navigate('App');
                            }
                        },
                        (err) => {
                            console.log(err);
                        });
                }
            },
            (err) => {
                console.log(err);
            });

    };

    _checkUserExistsAsync = async (email) => {
        Api.checkEmailExists(email,
            (res) => {
            },
            (err) => {
            });
    };


    render() {
        return (
            <Fragment>
                <Header>
                    <Left>
                        <Button transparent
                                onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                    <Title>Registrieren</Title>
                    </Body>
                    <Right/>
                </Header>
                <Container>
                    <Content style={{flex: 1}}>
                        <KeyboardAvoidingView>
                            <Form style={styles.form}>

                                <ValidatingTextField
                                    name='userName'
                                    validateAs='userName'
                                    label='eMail'
                                    onChangeText={(text) => this.setState({userName: text})}
                                    value={this.state.userName}
                                    externalError={this.state.userNameError}
                                    ref={(ref) => this.emailInput = ref}
                                    onBlur={(error) => {
                                        this.setState({userNameError: error})
                                    }}
                                />

                                <ValidatingTextField
                                    name='screenName'
                                    validateAs='screenName'
                                    label='Name'
                                    onChangeText={(text) => this.setState({screenName: text})}
                                    value={this.state.screenName}
                                    externalError={this.state.screenNameError}
                                    ref={(ref) => this.screenNameInput = ref}
                                    onBlur={(error) => {
                                        this.setState({screeNameError: error})
                                    }}

                                />

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

                                <Button
                                    disabled={!!(this.state.screenNameError || this.state.userNameError || this.state.passwordError)}
                                    full primary rounded style={{paddingBottom: 4, marginTop: 20,}}
                                        onPress={() => this.register()}>
                                    <Icon name="md-arrow-round-forward"/>
                                </Button>
                            </Form>
                        </KeyboardAvoidingView>

                    </Content>
                </Container>
            </Fragment>

        );
    };
}

const styles = StyleSheet.create(
    {
        form: {
            flex: 1,
            marginLeft: 20,
            marginRight: 20,
            marginTop: 40,
            marginBottom: 40
        },

        formLabel: {
            color: material.textColor,
            fontSize: 12,
            marginBottom: 5
        },

        formTextbox: {
            color: material.textColor,
            borderColor: material.textColor,
            marginBottom: 20
        }
    }
)

export default SignUpScreen;

/*

 <FormItem onPress={() => this.setState({gdprAccept: !this.state.gdprAccept})}>
                            <CheckBox checked={this.state.gdprAccept}>
                            </CheckBox>
                            <Text> Datenschutz? </Text>
                        </FormItem>
                        <FormItem onPress={() => this.setState({newsLetterAccept: !this.state.newsLetterAccept})}>
                            <CheckBox checked={this.state.newsLetterAccept}>
                            </CheckBox>
                            <Text> Newsletter? </Text>
                        </FormItem>

 */