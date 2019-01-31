import React, {Component} from 'react';
import {AsyncStorage} from 'react-native'
import {Button, CheckBox, Container, Content, Form, Header, Input, Item as FormItem, Label, Text} from "native-base";
import Expo, {Constants} from "expo";
import Api from "../../network/api";

class SignUpScreen extends Component {

    static navigationOptions = {
        title: 'Please sign in'
    };

    constructor() {
        super();
        this.state = {
            loading: true,
            screenName: '',
            password: '',
            password2: '',
            gdprAccept: false,
            newsLetterAccept: false
        };
    }

    async componentWillMount() {
        this.setState({email: this.props.navigation.state.params.email});
        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
        });
        this.setState({loading: false})
    }

    register = async () => {

        Api.register({
                screenname: this.state.screenName,
                username: this.state.email,
                password: this.state.password,
                confirm_password: this.state.password2,
                invite: null
            },
            async (res) => {
                console.log(res.data);
                if (res.status === 200) {
                    Api.login(this.state.email,
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
                            console.error(err);
                        });

                }
            },
            (err) => {
                console.error(err);
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
            return (<Expo.AppLoading/>)
        }
        return (
            <Container style={{paddingTop: Constants.statusBarHeight}}>
                <Header/>
                <Content>
                    <Form>
                        <FormItem floatingLabel>
                            <Label>Email</Label>
                            <Input name="email" disabled onChangeText={(text) => this.setState({email: text})}
                                   value={this.state.email}/>
                        </FormItem>
                        <FormItem floatingLabel>
                            <Label>Name</Label>
                            <Input name="screenname" onChangeText={(text) => this.setState({screenName: text})}
                                   value={this.state.screenName}/>
                        </FormItem>
                        <FormItem floatingLabel>
                            <Label>Passwort</Label>
                            <Input name="password" onChangeText={(text) => this.setState({password: text})}
                                   value={this.state.password}/>
                        </FormItem>
                        <FormItem floatingLabel>
                            <Label>Passwort bestätigen</Label>
                            <Input name="password2" onChangeText={(text) => this.setState({password2: text})}
                                   value={this.state.password2}/>
                        </FormItem>
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
                        <Button full primary style={{paddingBottom: 4}} onPress={() => this.register()}>
                            <Text> Next </Text>
                        </Button>
                    </Form>
                </Content>
            </Container>
        );
    };

}

export default SignUpScreen;
