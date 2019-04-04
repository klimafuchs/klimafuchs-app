import React, {Component} from 'react';
import {Image, RefreshControl, StyleSheet, View} from 'react-native';
import {
    Body,
    Button,
    Container,
    Content,
    Fab,
    H3,
    Icon,
    Left,
    List,
    ListItem,
    Right,
    Text,
    Thumbnail
} from "native-base";
import {MY_MEMBERSHIPS} from "../../network/Teams.gql";
import {Query} from "react-apollo";
import material from "../../../native-base-theme/variables/material";
import {CreateTeamModalContent} from "./CreateTeamModalContent";
import env from "../../env";
import {FSModal} from "../Common/FSModal";
import {TeamDetailsModalContent} from "./TeamDetailsModalContent";


export class TeamsScreen extends Component {
    state = {
        refreshing: false,
    };

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

            <FSModal
                ref={(ref) => {
                    this.teamPicker = ref;
                }}
                body={<CreateTeamModalContent
                    onComplete={refetch}
                    requestModalClose={() => this.teamPicker.closeModal()}/>}
            >
                <Button block
                        style={styles.ctaButton}
                        onPress={() => this.teamPicker.openModal()}>
                    <Text style={{color: material.tabBarTextColor}}>Team erstellen</Text>
                </Button>
            </FSModal>



            <Button block
                    style={styles.ctaButton}
                    onPress={() => {
                        this.props.navigation.navigate('Teams')
                    }}>
                <Text style={{color: material.tabBarTextColor}}>Team beitreten</Text>
            </Button>
        </View>
    );

    renderTeams = (memberships, refetch) => {
        return (
            <Container style={{flex: 1}}>
                <Content
                    style={{
                        marginTop: 5,
                        marginBottom: 5,
                    }}
                    refreshControl={<RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                            this.setState({refreshing: true});
                            refetch().then(this.setState({refreshing: false}))
                        }}
                    />
                    }>
                    <List>
                        {memberships.map((membership) => {
                            return (
                                <TeamCard key={membership.id} membership={membership}/>
                            )
                        })}
                    </List>
                </Content>
                <FSModal
                    ref={(ref) => {
                        this.teamPicker = ref;
                    }}
                    body={<CreateTeamModalContent
                        onComplete={refetch}
                        requestModalClose={() => this.teamPicker.closeModal()}/>}
                >
                    <Fab style={{backgroundColor: material.brandInfo}}
                         onPress={() => this.teamPicker.openModal()}
                         position="bottomRight">
                        <Icon name='md-add' style={{color: material.brandDark}}/>
                    </Fab>
                </FSModal>

            </Container>
        )
    };

    render() {
        return (
            <Container style={{flex: 1}}>
                <Query query={MY_MEMBERSHIPS}>
                    {({loading, error, data, refetch}) => {
                        if (loading) {
                            return <Text>Loading...</Text>;
                        }
                        if (error) return <Text>{error.message}</Text>;
                        if (data) {
                            if (data.myMemberships.length > 0) {
                                return this.renderTeams(data.myMemberships, refetch);
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

class TeamCard extends Component {

    overflowActionsConfig = {
        config:
            {
                options: [
                    {text: "Entfernen", icon: "md-alert", iconColor: "#fa213b"},
                    {text: "Zum Admin befördern", icon: "md-star", iconColor: "#25de5b"},
                    {text: "Abbrechen", icon: "cancel", iconColor: "#25de5b"}
                ],
                cancelButtonIndex: 2,
                destructiveButtonIndex: 0,
                title: ""
            },
        callback: (buttonIndex) => {
            this.overflowActionsConfig.actions[buttonIndex]();
            this.actionSheetAction({
                index: buttonIndex,
                pressed: this.overflowActionsConfig.config.options[buttonIndex]
            });
        },
        actions: [
            () => {
               
            },
            () => {
                console.log("action cancelled")
            },

        ],
    };

    actionSheetAction(param) {
        this.overflowActionsConfig.actions[param.index]();
    }


    render() {
        const {membership} = this.props;
        const teamAvatarUrl =
            membership.team.avatar
                ? `${env.dev.API_IMG_URL}${membership.team.avatar.filename}`
                : `${env.dev.API_IMG_URL}avatar_default.png`;
        return (

            <FSModal
                ref={(ref) => {
                    this.teamDetails = ref;
                }}
                body={<TeamDetailsModalContent
                    teamId={membership.team.id}
                    ownStatus={membership}
                    requestModalClose={() => this.teamDetails.closeModal()}
                    ref={(ref) => {
                        this.teamDetailsContent = ref
                    }}
                />}
            >
                <ListItem avatar onPress={() => {
                    this.teamDetails.openModal()
                }}>
                    <Left>
                        <Thumbnail source={{uri: teamAvatarUrl}}/>
                    </Left>
                    <Body style={{height: '100%'}}>
                    <Text>{membership.team.name}</Text>
                    </Body>
                    <Right>
                        <Icon name='md-square' style={{color: membership.isAdmin ? '#ffaa00' : '#555555'}}/>
                    </Right>
                </ListItem>
            </FSModal>


        )
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
