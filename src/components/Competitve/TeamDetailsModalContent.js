import React, {Fragment} from "react";
import {Image, View} from "react-native"
import {Body, Button, Card, CardItem, Content, H3, Icon, Left, Right, Spinner, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {FSModalContentBase} from "../Common/FSModal";
import {Query} from "react-apollo";
import {GET_MY_TEAM, TeamSize} from "../../network/Teams.gql";
import {Util} from "../../util";


export class TeamDetailsModalContent extends FSModalContentBase {

    cardContent = (team, refetch) => {
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

                {this.renderAdmins(team.members)}
                <CardItem style={{width: '100%', backgroundColor: material.containerBgColor}}/>
                {this.renderUsers(team.members)}
                <CardItem style={{width: '100%', backgroundColor: material.containerBgColor}}/>
                {this.renderJoinRequests(team.members)}

            </Fragment>
        )
    };

    renderAdmins = (members) => {
        const admins = members.filter(member => member.isAdmin);
        return (
            <Fragment>
                {admins.map(user => {
                    return <UserRow key={user.id} member={user}/>
                })}
            </Fragment>
        )
    };

    renderUsers = (members) => {
        const users = members.filter(member => !member.isAdmin && member.isActive);
        return (
            <Fragment>
                {users.map(user => {
                    return <UserRow key={user.id} member={user}/>

                })}
            </Fragment>
        )
    };

    renderJoinRequests = (members) => {
        const users = members.filter(member => !member.isAdmin && !member.isActive);
        return (
            <Fragment>
                {users.map(user => {
                    return <UserRow key={user.id} member={user}/>
                })}
            </Fragment>
        )
    };

    renderPlaceholder = <Card style={{
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


        return (
            <Query query={GET_MY_TEAM} variables={{
                teamId
            }}>
                {({loading, error, data, refetch}) => {
                    if (loading) return this.renderPlaceholder;
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
                                : this.cardContent(data.getMyTeam, refetch)

                            }
                        </Card>
                    )
                }}
            </Query>
        )
    };
}

const UserRow = ({member}) => {
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
            <Text style={isAdmin ? {fontWeight: 'bold'} : {}}>{member.user.screenName}</Text>
            </Body>
            <Right>
                <Button transparent dark onPress={() => {
                    if (member.isAdmin) {
                        console.log('admin')
                    }
                }}>
                    <Icon name={"md-more"}/>
                </Button>
            </Right>
        </CardItem>
    )
}