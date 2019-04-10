import React, {Component, Fragment} from "react";
import {AsyncStorage, Image, View} from "react-native"
import {ActionSheet, Body, Button, Card, CardItem, Content, H3, Icon, Left, Right, Spinner, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {FSModalContentBase} from "../Common/FSModal";
import {Mutation, Query} from "react-apollo";
import {CONFIRM_MEMBER, GET_MY_TEAM, TeamSize} from "../../network/Teams.gql";
import {Util} from "../../util";
import {MaterialDialog} from "react-native-material-dialog";

export class TeamDetailsModalContent extends FSModalContentBase {

    state = {
        uId: -1,
    };

    async componentWillMount() {
        let uId = await AsyncStorage.getItem('uId');
        this.setState({uId});
    }

    getOwnStatus = (members) => {
        let {uId} = this.state;
        let myMembership = members.filter((membership) => membership.id == uId)[0];
        if (!myMembership) {
            console.error("CurrentUser is not in getMyTeams result!");
            console.log(members, myMembership, uId)
        }
        return myMembership;
    };

    cardContent = (team, myMembership, refetch) => {
        return (
            <Fragment>
                <CardItem>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}><Text>Rang: </Text><Text>{team.place === -1 ? 'Nicht Plaziert' : team.place}</Text></View>
                    <View
                        style={{flex: 1, flexDirection: 'row'}}><Text>Punktzahl: </Text><Text>{team.score}</Text></View>
                </CardItem>
                <CardItem>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}><Text>Teamgröße: </Text><Text>{TeamSize[team.teamSize].name}</Text></View>
                </CardItem>
                <CardItem style={{width: '100%', backgroundColor: material.containerBgColor}}>
                    <Text>Teammitgileder</Text>
                </CardItem>

                {this.renderAdmins(team.members, myMembership)}
                <CardItem style={{width: '100%', backgroundColor: material.containerBgColor}}/>
                {this.renderUsers(team.members, myMembership)}
                <CardItem style={{width: '100%', backgroundColor: material.containerBgColor}}/>
                {this.renderJoinRequests(team.members, myMembership)}

            </Fragment>
        )
    };

    renderAdmins = (members, myMembership) => {
        const admins = members.filter(member => member.isAdmin);
        return (
            <Fragment>
                {admins.map(user => {
                    return <UserRow key={user.id} member={user} ownStatus={myMembership}/>
                })}
            </Fragment>
        )
    };

    renderUsers = (members, myMembership) => {
        const users = members.filter(member => !member.isAdmin && member.isActive);
        return (
            <Fragment>
                {users.map(user => {
                    return <UserRow key={user.id} member={user} ownStatus={myMembership}/>

                })}
            </Fragment>
        )
    };

    renderJoinRequests = (members, myMembership) => {
        const users = members.filter(member => !member.isAdmin && !member.isActive);
        return (
            <Fragment>
                {users.map(user => {
                    return <UserRow key={user.id} member={user} ownStatus={myMembership}/>
                })}
            </Fragment>
        )
    };

    renderPlaceholder = (requestModalClose) => <Card style={{
        margin: '10%',
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: material.containerBgColor,
    }}
    >

        <CardItem header style={
            {
                backgroundColor: material.brandInfo,
            }}>
            <Button transparent dark onPress={() => requestModalClose()}>
                <Icon style={{fontSize: 30}} name="close"/>
            </Button>
        </CardItem>
        <CardItem>
            <Spinner/>
        </CardItem>
    </Card>;

    render() {
        let {requestModalClose, teamId} = this.props;
        if (this.state.uId < 0) return this.renderPlaceholder(requestModalClose);

        return (
            <Query query={GET_MY_TEAM} variables={{
                teamId
            }}>
                {({loading, error, data, refetch}) => {
                    if (loading) return this.renderPlaceholder(requestModalClose);
                    return (
                        <Card style={{
                            margin: '10%',
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            backgroundColor: material.containerBgColor,
                        }}
                        >
                            <CardItem header style={
                                {
                                    backgroundColor: material.brandInfo,
                                }}>
                                <Button transparent dark onPress={() => requestModalClose()}>
                                    <Icon style={{fontSize: 30}} name="close"/>
                                </Button>
                                <H3 style={{
                                    color: 'white',
                                    flex: 1,
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                    alignItems: 'stretch',
                                    marginLeft: 10,

                                }}>{data ? data.getMyTeam.name : 'error'}</H3>
                            </CardItem>

                            {error ?
                                <Content><Text>{JSON.stringify(error)}</Text></Content>
                                : this.cardContent(data.getMyTeam, this.getOwnStatus(data.getMyTeam.members), refetch)

                            }
                        </Card>
                    )
                }}
            </Query>
        )
    };
}

class UserRow extends Component {

    state = {
        showAddUserDialog: false,
    };

    overflowUserActionsConfig = {
        config:
            {
                options: [
                    {text: "Zum Admin befördern", icon: "md-alert", iconColor: "#444"},
                    {text: "Entfernen", icon: "md-alert", iconColor: "#444"},
                    {text: "Abbrechen", icon: "close", iconColor: "#25de5b"}
                ],
                cancelButtonIndex: 2,
                destructiveButtonIndex: 1,
            },
        callback: (buttonIndex) => {
            this.overflowUserActionsConfig.actions[buttonIndex]();
        },
        actions: [
            //Zum Admin befördern
            () => {

            },
            //Entfernen
            () => {
            },
            //Abbrechen
            () => {
                console.log("action cancelled")
            },
        ],
    };

    overflowRequestActionsConfig = {
        config:
            {
                options: [
                    {text: "Annehemn", icon: "md-alert", iconColor: "#444"},
                    {text: "Entfernen", icon: "md-alert", iconColor: "#444"},
                    {text: "Abbrechen", icon: "close", iconColor: "#25de5b"}
                ],
                cancelButtonIndex: 2,
                destructiveButtonIndex: 1,
            },
        callback: (buttonIndex) => {
            this.overflowRequestActionsConfig.actions[buttonIndex]();
        },
        actions: [
            //Annehmen
            () => {
                this.setState({showAddUserDialog: true})
            },
            //Entfernen
            () => {
            },
            //Abbrechen
            () => {
                console.log("action cancelled")
            },
        ],
    };

    overflowAdminActionsConfig = {
        config:
            {
                options: [
                    {text: "Adminstatus entfernen", icon: "md-alert", iconColor: "#444"},
                    {text: "Abbrechen", icon: "close", iconColor: "#25de5b"}
                ],
                cancelButtonIndex: 1,
                destructiveButtonIndex: 0,
            },
        callback: (buttonIndex) => {
            this.overflowAdminActionsConfig.actions[buttonIndex]();
        },
        actions: [
            //Adminstatus entfernen
            () => {
            },
            //Abbrechen
            () => {
                console.log("action cancelled")
            },
        ],
    };

    render() {
        let {member, ownStatus} = this.props;
        console.log(member)
        const {isAdmin, isActive} = member;
        return (
            <CardItem style={{
                width: '100%',
                color: 'white',

            }}>
                <Left>
                    <Image
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: 16
                        }}
                        source={{uri: Util.AvatarToUri(member.user.avatar)}}
                        resizeMode="contain"/>
                </Left>
                <Body style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'stretch'
                }}>
                    <Text
                        style={isAdmin ? {fontWeight: 'bold'} : (isActive ? {} : {color: '#aaa'})}>{member.user.screenName}</Text>
                </Body>
                <Right>
                    <Button style={{width: 40, height: '100%', flex: 1, justifyContent: 'center'}} transparent dark
                            onPress={() => {
                                console.log(ownStatus);
                                if (ownStatus.isAdmin) member.isAdmin ? ActionSheet.show(
                                    this.overflowAdminActionsConfig.config,
                                    this.overflowAdminActionsConfig.callback
                                ) : (member.isActive ? ActionSheet.show(
                                        this.overflowUserActionsConfig.config,
                                        this.overflowUserActionsConfig.callback
                                    ) : ActionSheet.show(
                                        this.overflowRequestActionsConfig.config,
                                        this.overflowRequestActionsConfig.callback
                                    )
                                )
                            }}>
                        <Icon name={"md-more"}/>

                        <Mutation mutation={CONFIRM_MEMBER} errorPolicy="all">
                            {(confirmMember, {loading, error}) => {
                                return (
                                    <MaterialDialog
                                        title={`Nutzer zum Team hinzufügen?`}
                                        visible={this.state.showAddUserDialog}
                                        onOk={() => {
                                            confirmMember({
                                                variables: {
                                                    membershipId: member.id
                                                }
                                            }).catch((error) => console.log(error));
                                            this.setState({showAddUserDialog: false})
                                        }}
                                        onCancel={() => this.setState({showAddUserDialog: false})}>
                                        <Text>
                                            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
                                            eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed dia
                                        </Text>
                                    </MaterialDialog>
                                )
                            }}

                        </Mutation>

                    </Button>
                </Right>
            </CardItem>
        )
    }
}