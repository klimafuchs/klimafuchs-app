import React, {Component} from 'react';
import {Button, Container, Form, Input, Item as FormItem, Label, Text,} from 'native-base';
import Expo, {Constants} from "expo";
import Api from "../../network/api";

class CheckUserExistsScreen extends Component {

    static navigationOptions = {
        title: 'Please sign in'
    };

    constructor() {
        super();
        this.state = {
            loading: true,
            email: '',
        };
    }

    componentWillMount = async () => {
        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
        });
        this.setState({loading: false})
    };

    checkUserExists = async () => {
        console.log("check " + this.state.email);
        console.log(this.state);
        Api.checkEmailExists(this.state.email,
            (res) => {
                console.log(res.data.status == true);
                if(res.status === 200) {
                    this.props.navigation.navigate(res.data.status === "true" ? 'LoginScreen' : 'SignUpScreen', {email: this.state.email});
                }
            },
            (err) => {
                console.error(err);
        });
    };


    render() {
        if (this.state.loading) {
            return (<Expo.AppLoading/>)
        }
        return (
            <Container style={{paddingTop: Constants.statusBarHeight}}>
                <Form>
                    <FormItem floatingLabel>
                        <Label>Email</Label>
                        <Input name="email" onChangeText={(text) => this.setState({email: text})}
                               value={this.state.email}/>
                    </FormItem>
                    <Button full primary style={{paddingBottom: 4}} onPress={() => this.checkUserExists()}>
                        <Text> Next </Text>
                    </Button>
                </Form>
            </Container>
        );
    };

}

export default CheckUserExistsScreen;
