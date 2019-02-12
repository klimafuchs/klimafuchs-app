import React, {Component, Fragment} from 'react';
import {AsyncStorage, KeyboardAvoidingView, StyleSheet} from 'react-native'
import {
    Body,
    Button,
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item as FormItem,
    Label,
    Left,
    Right,
    Title
} from "native-base";
import Api from "../../network/api";
import material from '../../../native-base-theme/variables/material';

class SignUpScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screenName: '',
            password: '',
            password2: '',
            gdprAccept: false,
            newsLetterAccept: false
        };
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
                                onPress={() => navigation.goBack()}>
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
                                <Label style={styles.formlabel}>Email</Label>
                                <FormItem regular style={styles.formtextbox}>
                                    <Input name="email" onChangeText={(text) => this.setState({email: text})}
                                   value={this.state.email}/>
                        </FormItem>

                                <Label style={styles.formlabel}>Name</Label>
                                <FormItem regular style={styles.formtextbox}>
                            <Input name="screenname" onChangeText={(text) => this.setState({screenName: text})}
                                   value={this.state.screenName}/>
                        </FormItem>

                                <Label style={styles.formlabel}>Passwort</Label>
                                <FormItem regular style={styles.formtextbox}>
                                    <Input name="password"
                                           secureTextEntry={true}
                                           onChangeText={(text) => this.setState({password: text})}
                                   value={this.state.password}/>
                        </FormItem>

                                <Label style={styles.formlabel}>Passwort bestätigen</Label>
                                <FormItem regular last style={styles.formtextbox}>
                                    <Input name="password2"
                                           secureTextEntry={true}
                                           onChangeText={(text) => this.setState({password2: text})}
                                   value={this.state.password2}/>
                        </FormItem>

                                <Button full primary rounded style={{paddingBottom: 4, marginTop: 20,}}
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

        formlabel: {
            color: material.textColor,
            fontSize: 12,
            marginBottom: 5

        },

        formtextbox: {
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