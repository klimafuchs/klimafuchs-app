import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {Body, Button, Card, CardItem, Container, Content, Footer, Header, Icon, Text} from "native-base";
import UploadImage from "../Common/UploadImage";

class ProfileScreen extends Component {

    static navigationOptions = {
        title: 'Profile',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-person' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    constructor(props) {
        super(props);
    }

    _signOutAsync = async() => {
        await AsyncStorage.removeItem('uId');
        await AsyncStorage.removeItem('token');
        console.log("signed out");
        this.props.navigation.navigate('Auth');
    };

    render() {
        return (
            <Container>

                <Header />
                <Content padder>
                    <Card transparent style={{flex: 1}}>
                        <CardItem style={{flex: 1}}>
                            <Body>
                            <Text>ProfileScreen</Text>
                            <UploadImage onUploadFinished={(media) => console.log(media)}/>
                            </Body>
                        </CardItem>
                    </Card>
                </Content>
                <Footer>
                    <Button full primary onPress={this._signOutAsync}>
                        <Text>Sign Out!</Text>
                    </Button>

                </Footer>
            </Container>


        );
    };

}

export default ProfileScreen;
