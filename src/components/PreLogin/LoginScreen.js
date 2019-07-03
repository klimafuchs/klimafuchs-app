import React, {Component} from 'react';
import {AsyncStorage, Image, KeyboardAvoidingView, StyleSheet, View} from 'react-native'
import {Button, Card, CardItem, Container, Content, Form, H1, H3, Input, Item, Text, Toast} from "native-base";
import {LinearGradient} from "expo";
import Api from "../../network/api";
import {LocalizationProvider as L} from "../../localization/LocalizationProvider";

import material from '../../../native-base-theme/variables/material';


class LoginScreen extends Component {

    static navigationOptions = {
        title: L.get("loginscreen_title")
    };


    state = {
        email: '',
        password: '',
        loginError: false,
        showErrors: false
    };

    signIn = async () => {

        Api.login(this.state.email, this.state.password,
            async (res) => {
                console.log(res.data);
                if (res.status === 200) {
                    await AsyncStorage.setItem('uId', res.data.id.toString());
                    await AsyncStorage.setItem('token', res.data.token);

                    this.props.navigation.navigate('App')

                }
            },
            (err) => {
                console.log(err.response);
                Toast.show({
                    text: err.response.data,
                });
                this.setState({loginError: true})
            });

    };

    render() {

        return (
            <Container>
                <LinearGradient
                    colors={[
                        material.brandPrimary,
                        material.brandInfo
                    ]}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Content>
                        <KeyboardAvoidingView>
                            <View style={loginScreenStyles.container}>
                                <View style={{
                                    width: '100%',
                                    padding: 5,
                                    flex: 1,
                                    alignItems: 'center',
                                    marginBottom: 10
                                }}>
                                    <Image
                                        style={{flex: 1, width: 100, height: 100, margin: 5}}
                                        resizeMode="contain"
                                        source={require('../../../assets/KlimafuchsLogo.png')}
                                    />
                                    <H1 style={{color: 'white', fontWeight: 'bold'}}>Klimafuchs</H1>
                                </View>
                                <Card style={loginScreenStyles.loginCard}>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <H1>{L.get("login_card_title")}</H1>
                                    </CardItem>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <Form style={{flex: 1}}>
                                            <Item regular
                                                  style={loginScreenStyles.loginFormTextInput}
                                                  error={this.state.loginError}
                                            >

                                                <Input name="email"
                                                       placeholder={L.get("email_placeholder")}
                                                       onChangeText={(text) => this.setState({email: text})}
                                                       value={this.state.email}
                                                       placeholderTextColor={material.brandInfo}
                                                />
                                            </Item>
                                            <Item regular
                                                  style={loginScreenStyles.loginFormTextInput}
                                                  error={this.state.loginError}
                                            >

                                                <Input name="password"
                                                       placeholder={L.get("password_placeholder")}
                                                       secureTextEntry
                                                       onChangeText={(text) => this.setState({password: text})}
                                                       value={this.state.password}
                                                       placeholderTextColor={material.brandInfo}
                                                />
                                            </Item>
                                        </Form>
                                    </CardItem>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <H3 style={{color: material.textColor}}
                                            onPress={() => {
                                                console.log(`${this.constructor.name}: register clicked!`);
                                                this.props.navigation.navigate('SignUpScreen', {email: this.state.email});
                                            }}>
                                            Registrieren
                                        </H3>
                                        <H3>|</H3>
                                        <H3 style={{color: material.textColor}}
                                            onPress={() => {
                                                console.log(`${this.constructor.name}: forgot_password clicked!`);
                                                this.props.navigation.navigate('ForgotPasswordScreen', {email: this.state.email});

                                            }}>
                                            Passwort vergessen?
                                        </H3>
                                    </CardItem>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <Text style={{color: material.textColor}}
                                              onPress={() => {
                                                  console.log(`${this.constructor.name}: eula clicked!`);

                                              }}>
                                            {L.get("eula")}
                                        </Text>
                                        <Text>|</Text>
                                        <Text style={{color: material.textColor}}
                                              onPress={() => {
                                                  console.log(`${this.constructor.name}: privacy clicked!`)

                                              }}>
                                            {L.get("privacy_policy")}
                                        </Text>
                                    </CardItem>
                                </Card>
                                <Button full primary rounded style={loginScreenStyles.loginButton}
                                        onPress={() => this.signIn()}>
                                    <Text style={{fontWeight: 'bold'}}>{L.get('login')}</Text>
                                </Button>
                            </View>
                        </KeyboardAvoidingView>
                    </Content>
                </LinearGradient>

            </Container>
        );
    };

}

export const loginScreenStyles = StyleSheet.create({
    container: {},
    row: {
        alignSelf: 'center',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,0,255,0)'

    },
    loginCard: {
        backgroundColor: 'rgba(230, 230, 230, 0.7)',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9,
        padding: 10,
        margin: 10,
        shadowRadius: 5,
    },
    loginCardItem: {
        backgroundColor: 'rgba(255, 255, 255, 0)',
        padding: 10,
    },
    loginFormTextInput: {
        backgroundColor: 'rgba(255, 255, 255, .8)',
        margin: 10,
        color: material.textColor,
        borderColor: material.brandInfo,
        marginBottom: 20
    },
    loginButton: {
        padding: 10,
        margin: 10,
        marginTop: 20,
    },
});

export default LoginScreen;
