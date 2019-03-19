import React, {Fragment} from "react";
import {Image, View} from "react-native"
import {Body, Button, Card, CardItem, Content, H3, Icon, Left, Right, Text} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {FSModalContentBase} from "../Common/FSModal";
import {Query} from "react-apollo";
import {GET_MY_TEAM} from "../../network/Teams.gql";
import {Util} from "../../util";


export class TeamDetailsModalContent extends FSModalContentBase {

    cardContent = (team, refetch) => {
        return (
            <Fragment>
                <CardItem>
                    <View style={{flex: 1, flexDirection: 'row'}}><Text>Rang: </Text><Text>{team.place}</Text></View>
                    <View
                        style={{flex: 1, flexDirection: 'row'}}><Text>Punktzahl: </Text><Text>{team.score}</Text></View>
                </CardItem>
                <CardItem>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row'
                    }}><Text>Teamgröße: </Text><Text>{team.teamSize}</Text></View>
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

    render() {
        let {requestModalClose, teamId} = this.props;


        return (
            <Query query={GET_MY_TEAM} variables={{
                teamId
            }}>
                {({loading, error, data, refetch}) => {
                    if (loading) return <Text>loading...</Text>
                    return (
                        <Card style={{
                            margin: '10%',
                            flex: 1,
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            backgroundColor: material.containerBgColor,
                        }}
                        >
                            <CardItem header style={{backgroundColor: material.brandInfo}}>
                                <Left>
                                    <Button transparent dark onPress={() => requestModalClose()}>
                                        <Icon info name="close"/>
                                    </Button>
                                </Left>
                                <H3>{loading ? "loading ..." : data.getMyTeam.name}</H3>
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
        <CardItem style={{width: '100%'}}>
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
            <Body><Text style={isAdmin ? {fontWeight: 'bold'} : {}}>{member.user.screenName}</Text></Body>
            <Right>
                <Button transparent dark>
                    <Icon name={"md-more"}/>
                </Button>
            </Right>
        </CardItem>
    )
}