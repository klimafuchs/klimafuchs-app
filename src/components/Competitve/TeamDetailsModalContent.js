import React, {Component, Fragment} from "react";
import {AsyncStorage, Image, View} from "react-native"
import {ActionSheet, Body, Button, Card, CardItem, Content, H3, Icon, Left, Right, Spinner, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {FSModalContentBase} from "../Common/FSModal";
import {Mutation, Query} from "react-apollo";
import {CONFIRM_MEMBER, DEL_USER, GET_MY_TEAM, GET_TEAM, MOD_USER, TeamSize, UNMOD_USER} from "../../network/Teams.gql";
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
            console.log(members, myMembership, uId)
        }
        return myMembership;
    };

    cardContent = (team, myMembership, refetch, editMode) => {
        let showUsers = team.closed ? (myMembership && myMembership.isActive) : true;
        let showRequests = myMembership && myMembership.isAdmin;

        console.log(showUsers, team.closed, myMembership);
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
                        flexDirection: 'row',
                        justifyContent: 'space-between',

                    }}>
                        <Text>Teamgröße: {TeamSize[team.teamSize].name}</Text>
                        <Icon name="md-lock" style={{color: material.textLight}}/>
                    </View>
                </CardItem>
                {showUsers &&
                <Fragment>
                    <CardItem style={{width: '100%', backgroundColor: '#ECECEC'}}>
                        <Text>Teammitgileder</Text>
                    </CardItem>

                    {this.renderAdmins(team.members, myMembership, editMode, refetch)}
                    <CardItem style={{width: '100%', backgroundColor: '#ECECEC'}}/>
                    {this.renderUsers(team.members, myMembership, editMode, refetch)}
                    <CardItem style={{width: '100%', backgroundColor: '#ECECEC'}}/>
                    {showRequests && this.renderJoinRequests(team.members, myMembership, editMode, refetch)}
                </Fragment>}

            </Fragment>
        )
    };

    renderAdmins = (members, myMembership, editMode, refetch) => {
        const admins = members.filter(member => member.isAdmin);
        return (
            <Fragment>
                {admins.map(user => {
                    return <UserRow key={user.id} member={user} ownStatus={myMembership} editMode={editMode} refetch={refetch}/>
                })}
            </Fragment>
        )
    };

    renderUsers = (members, myMembership, editMode, refetch) => {
        const users = members.filter(member => !member.isAdmin && member.isActive);
        return (
            <Fragment>
                {users.map(user => {
                    return <UserRow key={user.id} member={user} ownStatus={myMembership} editMode={editMode} refetch={refetch}/>

                })}
            </Fragment>
        )
    };

    renderJoinRequests = (members, myMembership, editMode, refetch) => {
        const users = members.filter(member => !member.isAdmin && !member.isActive);
        return (
            <Fragment>
                {users.map(user => {
                    return <UserRow key={user.id} member={user} ownStatus={myMembership} editMode={editMode} refetch={refetch}/>
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
        let {requestModalClose, teamId, editMode} = this.props;
        if (this.state.uId < 0) return this.renderPlaceholder(requestModalClose);

        return (
            <Query query={GET_TEAM} variables={{
                teamId
            }}>
                {({loading, error, data, refetch}) => {
                    if (loading) return this.renderPlaceholder(requestModalClose);
                    const ownStatus = this.getOwnStatus(data.getTeam.members);
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
                                    backgroundColor: (ownStatus && ownStatus.isActive) ? material.brandInfo : material.brandPrimary,
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

                                }}>{data ? data.getTeam.name : 'error'}</H3>
                            </CardItem>

                            {error ?
                                <Content><Text>{JSON.stringify(error)}</Text></Content>
                                : this.cardContent(data.getTeam, ownStatus, refetch, editMode)

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
        showRemoveUserDialog: false,
        showDeclineUserDialog: false,
        showMakeAdminDialog: false,
        showDemoteAdminDialog: false,
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
                this.setState({showMakeAdminDialog: true})

            },
            //Entfernen
            () => {
                this.setState({showRemoveUserDialog: true})

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
                this.setState({showDeclineUserDialog: true})
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
                this.setState({showDemoteAdminDialog: true})

            },
            //Abbrechen
            () => {
                console.log("action cancelled")
            },
        ],
    };

    render() {
        let {member, ownStatus, editMode, refetch} = this.props;
        const {isAdmin, isActive} = member;
        console.log(editMode)
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
                {editMode && <Right>
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
                                            })
                                                .then()
                                                .catch((error) => console.log(error));
                                            this.setState({showAddUserDialog: false})
                                        }}
                                        onCancel={() => this.setState({showAddUserDialog: false})}>
                                        <Fragment/>
                                    </MaterialDialog>
                                )
                            }}
                        </Mutation>

                        <Mutation mutation={MOD_USER} errorPolicy="all">
                            {(modMember, {loading, error}) => {
                                return (
                                    <MaterialDialog
                                        title={`Nutzer zum Admin machen?`}
                                        visible={this.state.showMakeAdminDialog}
                                        onOk={() => {
                                            modMember({
                                                variables: {
                                                    membershipId: member.id
                                                }
                                            })
                                                .then()
                                                .catch((error) => console.log(error));

                                            this.setState({showMakeAdminDialog: false})
                                        }}
                                        onCancel={() => this.setState({showMakeAdminDialog: false})}>
                                        <Fragment/>

                                    </MaterialDialog>
                                )
                            }}
                        </Mutation>

                        <Mutation mutation={UNMOD_USER} errorPolicy="all">
                            {(unmodMember, {loading, error}) => {
                                return (
                                    <MaterialDialog
                                        title={`Admin zu normalem Benutzer machen?`}
                                        visible={this.state.showDemoteAdminDialog}
                                        onOk={() => {
                                            unmodMember({
                                                variables: {
                                                    membershipId: member.id
                                                }
                                            })
                                                .then()
                                                .catch((error) => console.log(error));

                                            this.setState({showDemoteAdminDialog: false})
                                        }}
                                        onCancel={() => this.setState({showDemoteAdminDialog: false})}>
                                        <Fragment/>
                                    </MaterialDialog>
                                )
                            }}
                        </Mutation>

                        <Mutation mutation={DEL_USER} errorPolicy="all">
                            {(delMember, {loading, error}) => {
                                return (
                                    <MaterialDialog
                                        title={`Nutzer entfernen?`}
                                        visible={this.state.showRemoveUserDialog}
                                        onOk={() => {
                                            delMember({
                                                variables: {
                                                    membershipId: member.id
                                                }
                                            })
                                                .then()
                                                .catch((error) => console.log(error));
                                            this.setState({showRemoveUserDialog: false})
                                        }}
                                        onCancel={() => this.setState({showRemoveUserDialog: false})}>
                                        <Fragment/>
                                    </MaterialDialog>
                                )
                            }}
                        </Mutation>

                        <Mutation mutation={DEL_USER} errorPolicy="all">
                            {(delMember, {loading, error}) => {
                                return (
                                    <MaterialDialog
                                        title={`Nutzer ablehnen?`}
                                        visible={this.state.showDeclineUserDialog}
                                        onOk={() => {
                                            delMember({
                                                variables: {
                                                    membershipId: member.id
                                                }
                                            })
                                                .then()
                                                .catch((error) => console.log(error));
                                            this.setState({showDeclineUserDialog: false})
                                        }}
                                        onCancel={() => this.setState({showDeclineUserDialog: false})}>
                                        <Fragment/>
                                    </MaterialDialog>
                                )
                            }}
                        </Mutation>
                    </Button>
                </Right>}
            </CardItem>
        )
    }
}