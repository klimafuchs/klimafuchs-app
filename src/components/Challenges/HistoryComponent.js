import React, {Component} from 'react';
import {Body, Container, Content, Card, CardItem, H1, Header, Icon, Left, Right, Title} from 'native-base';
import {Image, Text, View} from "react-native";
import * as Constants from "expo";
import {Query} from "react-apollo";
import {SEASONS} from "../../network/Challenges.gql";

export class HistoryComponent extends Component {
    static navigationOptions = {
        title: 'Trophäen',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-trophy' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    render() {
        return (
            <Container>
                <Content>
                <Card>
                    <CardItem>
                        <Body style={{flex:1, alignItems: 'center'}}>
                            <H1>2019</H1>
                        </Body>
                    </CardItem>
                    <CardItem style={{height: 400}}>
                        <Image
                            style={{width: '100%', height: '100%', margin: 5}}
                            resizeMode="cover"
                            source={require('../../../assets/vector/Hintergruende_Trophaee/trophäe_sommer.png')}
                        />
                    </CardItem>
                </Card>
                    <Body style={{padding: 10}}>
                        <Text>Die Season geht vom x bis zum x.
                            Pro Monat wächst der Baum, es gibt also drei verschiedene Größen.
                            Damit der Baum Blätter bekommt, müssen Challenges erfüllt werden, ansonsten bleibt der Baum kahl. Jede Woche gibt es vier Challenges. Für jede Challenge erhältst du ein Blatt. Je mehr Blätter du hast, desto grüner werden sie. Dein Gesamtergebnis in einer Season entscheidet darüber, wie grün dein Baum ist, wenn er in eine Trophäe transformiert wird.</Text>
                </Body>
                </Content>
            </Container>
        );
    }
    /*
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
    */
}
