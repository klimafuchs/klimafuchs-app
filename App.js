import React, {Component} from 'react';
import {AsyncStorage,  StatusBar, StyleSheet, Text, View,SafeAreaView} from 'react-native';
import {createAppContainer,createStackNavigator, createSwitchNavigator} from "react-navigation";
import {Root, Spinner, StyleProvider} from 'native-base';
import LoginScreen from "./src/components/PreLogin/LoginScreen";
import SignUpScreen from "./src/components/PreLogin/SignUpScreen";
import CheckUserExistsScreen from "./src/components/PreLogin/CheckUserExistsScreen";
import {connect, Provider as ReduxProvider} from "react-redux";
import getTheme from './native-base-theme/components';
import material from './native-base-theme/variables/material';
import {store, persistor} from "./src/persistence/store"
import { PersistGate } from 'redux-persist/integration/react'

import {AppNav} from "./src/components/LoggedInScreen";
import {ForgotPasswordScreen} from "./src/components/PreLogin/ForgotPasswordScreen";
import {Font, Notifications} from "expo";
import ApolloProvider from "react-apollo/ApolloProvider";
import client from "./src/network/client"
import Api from "./src/network/api";
const prefix = Expo.Linking.makeUrl('/');

export default class AppRoot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    handleNotification = (notification) => {
        store.dispatch({type: 'NOTIFICATIONS/RECEIVE', notification});
        console.log("received notification: " + JSON.stringify(notification))
    };

    componentDidMount() {
        console.log(this.props)
        this._notificationSubscription = Notifications.addListener(this.handleNotification);
    }

    async componentWillMount() {
        await Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
        });
        this.setState({loading: false})
    }

    render() {
        if (this.state.loading) {
            return (
                <Spinner/>
            )
        }
        return (
            <ReduxProvider store={store}>
                <PersistGate loading={<Spinner/>} persistor={persistor}>
                <ApolloProvider client={client}>
                    <StyleProvider style={getTheme(material)}>
                        <Root>
                            <SafeAreaView style={styles.safeArea}>
                                <RootContainer uriPrefix={prefix}/>
                            </SafeAreaView>
                        </Root>
                    </StyleProvider>
                </ApolloProvider>
                </PersistGate>
            </ReduxProvider>
        )
    }
}


class AuthLoadingScreen extends Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }

    async _bootstrapAsync() {
        console.log("Is logged in?");
        const userToken = await AsyncStorage.getItem('token');
        const isValid = await this.checkLogin(userToken);

        console.log("Logged In ? " + isValid);
        this.props.navigation.navigate(isValid ? 'App' : 'Auth');
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>AuthLoadingScreen</Text>
                <StatusBar barStyle="default"/>
            </View>
        )
    }

    checkLogin = async (userToken) => {
      return  Api.checkTokenValid(userToken, () => {return  true}, () => { return  false})

    }
}


const AuthNav = createStackNavigator({
        CheckUserExistsScreen: {
            screen: CheckUserExistsScreen
        },
        LoginScreen: {
            screen: LoginScreen
        },
        SignUpScreen: {
            screen: SignUpScreen
        },
        ForgotPasswordScreen: {
            screen: ForgotPasswordScreen
        }
    },
    {
        headerMode: 'none',
        navigationOptions: {
            headerVisible: false,
        },
        initialRouteName: 'LoginScreen',
    });

const RootNavigation = createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    App: AppNav,
    Auth: AuthNav
}, {
    initialRouteName: 'AuthLoading'
});
const RootContainer = createAppContainer(RootNavigation);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    safeArea: {
        flex: 1,
        backgroundColor: material.brandInfo
    }
});
