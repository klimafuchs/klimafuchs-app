import React, {Component} from 'react';
import {Container, Icon, Text} from "native-base";

export class NotificationsScreen extends Component {
    static navigationOptions = {
        title: 'Feed',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-notifications' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    render() {
        return (
            <Container>
                <Text>Not implemented</Text>
            </Container>
        );
    }
}