import React, {Component} from 'react';
import {AsyncStorage, Image, StyleSheet, View} from 'react-native'
import {Grid, Row} from "react-native-easy-grid";
import {Button, Card, CardItem, Container, Form, H1, H3, Input, Item, Text, Toast} from "native-base";
import Expo, {LinearGradient, AppLoading, Font} from "expo";
import Api from "../../network/api";

class LoginScreen extends Component {

    static navigationOptions = {
        title: 'Please sign in'
    };

    constructor() {
        super();
        this.state = {
            loading: true,
            email: '',
            password: '',
            loginError: false,
        };
    }

    async componentWillMount() {
        console.log(this.props.navigation.state.params);
        if (!!this.props.navigation.state.params && !!this.props.navigation.state.params.email) {
            this.setState({email: this.props.navigation.state.params.email});
        }
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
        });
        this.setState({loading: false});
    }

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

    _checkUserExistsAsync = async (email) => {
        Api.checkEmailExists(email,
            (res) => {
            },
            (err) => {
            });
    };


    render() {
        if (this.state.loading) {
            return (<AppLoading/>)
        }
        return (
            <Container>
                <LinearGradient
                    colors={['#8dc2db', '#b8d497']}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View style={loginScreenStyles.container} contentContainerStyle={loginScreenStyles.row}>
                        <Grid style={{alignItems: 'flex-start'}}>
                            <Row size={1} style={{margin: 10}}>
                                <Image
                                    style={{flex: 1, height: undefined, width: undefined}}
                                    resizeMode="contain"
                                    source={require('../../../assets/KlimafuchsLogo.png')}
                                />
                            </Row>
                            <Row size={2}>
                                <Card style={loginScreenStyles.loginCard}>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <H1>Login</H1>
                                    </CardItem>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <Form style={{flex: 1}}>
                                            <Item regular
                                                  style={loginScreenStyles.loginFormTextInput}
                                                  error={this.state.loginError}
                                            >
                                                <Input name="email"
                                                       placeholder="eMail"
                                                       onChangeText={(text) => this.setState({email: text})}
                                                       value={this.state.email}/>
                                            </Item>
                                            <Item regular
                                                  style={loginScreenStyles.loginFormTextInput}
                                                  error={this.state.loginError}
                                            >
                                                <Input name="password"
                                                       secureTextEntry={true}
                                                       placeholder="Passwort"
                                                       onChangeText={(text) => this.setState({password: text})}
                                                       value={this.state.password}/>
                                            </Item>
                                        </Form>
                                    </CardItem>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <H3 style={{color: 'blue'}}
                                            onPress={() => {
                                                console.log(`${this.constructor.name}: register clicked!`);
                                                this.props.navigation.navigate('SignUpScreen', {email: this.state.email});
                                            }}>
                                            Registrieren
                                        </H3>
                                        <H3>|</H3>
                                        <H3 style={{color: 'blue'}}
                                            onPress={() => {
                                                console.log(`${this.constructor.name}: forgot_password clicked!`);
                                                this.props.navigation.navigate('ForgotPasswordScreen', {email: this.state.email});

                                            }}>
                                            Passwort vergessen?
                                        </H3>
                                    </CardItem>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <Text style={{color: 'blue'}}
                                              onPress={() => {
                                                  console.log(`${this.constructor.name}: eula clicked!`);

                                              }}>
                                            AGBs
                                        </Text>
                                        <Text>|</Text>
                                        <Text style={{color: 'blue'}}
                                              onPress={() => {
                                                  console.log(`${this.constructor.name}: privacy clicked!`)

                                              }}>
                                            Datenschutzerklärung
                                        </Text>
                                    </CardItem>
                                </Card>
                            </Row>
                            <Row size={1} style={loginScreenStyles.row}>
                                <Button primary style={loginScreenStyles.loginButton} onPress={() => this.signIn()}>
                                    <Text>Login</Text>
                                </Button>
                            </Row>
                        </Grid>
                    </View>
                </LinearGradient>
            </Container>
        );
    };

}

export const loginScreenStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',

        backgroundColor: 'rgba(255,0,255,0)'
    },
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
        borderRadius: 5,
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
    },
    loginButton: {
        backgroundColor: 'rgb(166,203,0)',
        padding: '10%',
        alignSelf: 'center',
    }

});

export default LoginScreen;
