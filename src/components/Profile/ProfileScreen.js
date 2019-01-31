import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {Body, Button, Card, CardItem, Container, Content, Footer, Header, Icon, Text} from "native-base";
import Expo from "expo";
import UploadImage from "../UploadImage";

class ProfileScreen extends Component {

    static navigationOptions = {
        title: 'Profile',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-person' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    constructor(props) {
        super(props);
        this.state = { loading: true };
    }

    async componentWillMount() {
        await Expo.Font.loadAsync({
            Roboto: require("native-base/Fonts/Roboto.ttf"),
            Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
            Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
        });
        this.setState({ loading: false})
    }

    _signOutAsync = async() => {
        await AsyncStorage.removeItem('uId');
        await AsyncStorage.removeItem('token');
        console.log("signed out");
        console.log(this.props.navigation);
        this.props.navigation.dispatch({
            type: 'Navigation/NAVIGATE', routeName: 'RootNavigation', action: {
                type: 'Navigation/NAVIGATE',
                routeName: 'Auth'
            }
        });
        //this.props.navigation.navigate('Auth');
    };

    render() {
        if (this.state.loading) {
            return(<Expo.AppLoading/>)
        }
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
