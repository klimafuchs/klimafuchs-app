import React, {Component} from 'react';
import {Body, Container, Content, H1, Header, Icon, Left, Right, Title} from 'native-base';
import {Text} from "react-native";
import * as Constants from "expo";
import {Query} from "react-apollo";
import {SEASONS} from "../../network/Challenges.gql";

export class HistoryComponent extends Component {
    static navigationOptions = {
        title: 'Trophaeen',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-trophy' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    render() {
        return (
            <Container>
                <H1>TODO</H1>
                <Query query={SEASONS}>
                    {({loading, error, data, refetch}) => {
                        if (loading) return <Text>Loading...</Text>;
                        if (error) return <Text>Error {error.message}</Text>;
                        if (data.seasons) {
                            return <Content><Text>{JSON.stringify(data.seasons, null, 2)}</Text></Content>
                        }
                        return (
                            <Text>no seasons!</Text>
                        )
                    }}
                </Query>
            </Container>
        );
    }
}
