import React, {Component} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Button, Container, H3, Text} from "native-base";
import {MY_MEMBERSHIPS} from "../../network/Teams.gql";
import {Query} from "react-apollo";
import material from "../../../native-base-theme/variables/material";
import {CreateTeamModal} from "./CreateTeamModal";


export class TeamsScreen extends Component {
    static navigationOptions = {
        title: 'Meine Teams',
    };

    renderTeamsGettingStarted = (refetch) => (
        <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginLeft: '10%',
            marginRight: '10%',
            marginTop: '20%',
            marginBottom: '20%',
        }}>
            <Image
                style={{width: 100, height: 100, margin: 5}}
                resizeMode="contain"
                source={require('../../../assets/asset_missing.png')}
            />
            <H3 style={{marginBottom: '5%'}}>Du hast noch kein Team</H3>

            <CreateTeamModal onComplete={refetch}/>
            <Button block
                    style={styles.ctaButton}
                    onPress={() => {
                        this.props.navigation.navigate('Teams')
                    }}>
                <Text style={{color: material.tabBarTextColor}}>Team beitreten</Text>
            </Button>
        </View>
    );

    renderTeams = (memberships) => (
        <Text>teams exist</Text>
    );

    render() {
        return (
            <Container>
                <Query query={MY_MEMBERSHIPS}>
                    {({loading, error, data, refetch}) => {
                        if (loading) return <Text>Loading...</Text>;
                        if (error) return <Text>{error.message}</Text>;
                        if (data) {
                            if (data.myMemberships.length > 0) {
                                return this.renderTeams(data.myMemberships);
                            } else {
                                return this.renderTeamsGettingStarted(refetch)
                            }
                        }
                    }}
                </Query>
            </Container>
        );
    }

}

const styles = StyleSheet.create({
    ctaButton: {
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 9,
        marginLeft: '20%',
        marginRight: '20%',
    },
});
