import React, {Component} from 'react';
import {Body, Container, Header, Icon, Left, Right, Title} from 'native-base';
import {Text} from "react-native";
import * as Constants from "expo";
import {Query} from "react-apollo";
import {CURRENT_SEASON} from "../../network/Challenges.gql";
import {SeasonProgressComponent} from "./SeasonProgressComponent";

export class SeasonComponent extends Component {
    static navigationOptions = {
        title: 'Season',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='image' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    render() {
        return (
            <Container>
                <Header style={{paddingTop: Constants.statusBarHeight}}>
                    <Left/>
                    <Body>
                    <Title>Season</Title>
                    </Body>
                    <Right/>
                </Header>
                <Query query={CURRENT_SEASON}>
                    {({loading, error, data, refetch}) => {
                        if (loading) return <Text>Loading...</Text>;
                        if (error) return <Text>Error {error.message}</Text>;

                        return (
                            <SeasonProgressComponent/>
                        )
                    }}
                </Query>


            </Container>
        );
    }
}
