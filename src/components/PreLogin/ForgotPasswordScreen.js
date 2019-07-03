import React, {Component} from 'react'
import {LinearGradient} from "expo";
import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Form,
    H1,
    Header,
    Icon,
    Input,
    Item,
    Left,
    Right,
    Text,
    Toast
} from "native-base";
import {View} from "react-native";
import {Grid, Row} from "react-native-easy-grid";
import {loginScreenStyles} from "./LoginScreen";
import Api from "../../network/api";

export class ForgotPasswordScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
        }
    }

    resetPassword = () => {
        if (this.state.email === '') {
            Toast.show({
                text: err.response.data,
            });
            return;
        }
        Api.requestPasswordReset(this.state.email,
            (res) => {
                Toast.show({
                    text: renderList.get("toast_password_reset_success"),
                })
            },
            (err) => {
                Toast.show({
                    text: err.response.data,
                })
            });
    }

    render() {

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => {
                            this.props.navigation.navigate('LoginScreen', {email: this.state.email});
                        }}>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>

                    </Body>
                    <Right>

                    </Right>
                </Header>
                <LinearGradient
                    colors={['#8dc2db', '#b8d497']}
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <View style={loginScreenStyles.container} contentContainerStyle={loginScreenStyles.row}>
                        <Grid style={{alignItems: 'flex-start'}}>

                            <Row size={2}>
                                <Card style={loginScreenStyles.loginCard}>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <H1>{renderList.get("reset_password_title")}</H1>
                                    </CardItem>
                                    <CardItem style={loginScreenStyles.loginCardItem}>
                                        <Form style={{flex: 1}}>
                                            <Item regular style={loginScreenStyles.loginFormTextInput}>
                                                <Input name="email"
                                                       placeholder={renderList.get("email_placeholder")}
                                                       onChangeText={(text) => this.setState({email: text})}
                                                       value={this.state.email}/>
                                            </Item>

                                        </Form>
                                    </CardItem>

                                </Card>
                            </Row>
                            <Row size={1} style={loginScreenStyles.row}>
                                <Button primary style={loginScreenStyles.loginButton}
                                        onPress={() => this.resetPassword()}>
                                    <Text>{renderList.get("reset_password_action")}</Text>
                                </Button>
                            </Row>
                        </Grid>
                    </View>
                </LinearGradient>
            </Container>
        )
            ;
    }
}