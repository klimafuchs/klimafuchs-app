import React, {Component, Fragment} from 'react';
import {RefreshControl, Text, View, ImageBackground} from 'react-native';
import {Body, Button, Container, Content, Form, Icon, List, ListItem, Picker, Right, Left, Spinner} from "native-base";
import {Mutation, Query} from "react-apollo";
import {CURRENT_USER_ID, LEADERBOARD, REQUEST_JOIN_TEAM, TeamSize} from "../../network/Teams.gql";
import * as env from "../../env"
import {MaterialDialog} from 'react-native-material-dialog';
import { BlurView } from 'expo';
import material from "../../../native-base-theme/variables/material";
import {TeamDetailsModalContent} from "./TeamDetailsModalContent";
import {FSModal} from "../Common/FSModal";
export class LeaderBoardScreen extends Component {
    static navigationOptions = {
        title: 'Leaderboard',
    };

    state = {
        refreshing: false,
        endReached: false,
        sizeFilter: TeamSize.SOLO.value,
        user: undefined
    };

    sizeOptions = () => {
        return Object.keys(TeamSize).map(option =>
            <Picker.Item key={option} label={TeamSize[option].name} value={TeamSize[option].value}/>)
    };

    pageSize = 10;


    render() {
        return (
            <Query query={CURRENT_USER_ID}>
                {({loading, error, data}) => {
                    if (loading) return <Spinner/>;
                    if (error) return <Text>{error}</Text>
                    const userId = data.getCurrentUser.id;
                    return (
                        <Container style={{flex: 1}}>
                            <Form>
                                <Picker mode="dropdown"
                                        iosHeader="Team größe"
                                        iosIcon={<Icon name="arrow-down"/>}
                                        style={{width: undefined}}
                                        selectedValue={this.state.sizeFilter}
                                        onValueChange={(value) => {
                                            console.log(value);
                                            this.setState({sizeFilter: value})
                                        }}
                                >
                                    {this.sizeOptions()}
                                </Picker>
                            </Form>
                            <Query query={LEADERBOARD}
                                   variables={{
                                       connectionArgs: {first: this.pageSize},
                                       teamSize: this.state.sizeFilter
                                   }}>
                                {({loading, error, data, refetch, fetchMore}) => {
                                    if (loading) {
                                        return <Text>Loading...</Text>;
                                    }
                                    if (error) return <Text>{error.message}</Text>;
                                    if (data.getLeaderBoard) {
                                        if (data.getLeaderBoard.page.edges.length > 0) {
                                            return (
                                                <Fragment>
                                                    {this.renderLeaderBoard(data.getLeaderBoard.page.edges, refetch, this.renderFetchMoreButton(data, loading, fetchMore), userId)}
                                                </Fragment>
                                            );
                                        } else {
                                            return (
                                                <Fragment>
                                                    <Text>hm...</Text>
                                                    {this.renderFetchMoreButton(data, loading, fetchMore)}
                                                </Fragment>
                                            )
                                        }
                                    } else {
                                        return (
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
                                                <Text>hmm...</Text>
                                            </Content>
                                        )
                                    }
                                }}
                            </Query>
                        </Container>
                    )
                }}
            </Query>
        );
    }

    renderFetchMoreButton(data, loading, fetchMore) {
        return (
            <Button full light disabled={this.state.refreshing || this.state.endReached} onPress={() => {
                const lastCursor = data.getLeaderBoard.page.edges[data.getLeaderBoard.page.edges.length - 1].cursor;
                console.log(lastCursor)
                fetchMore({
                    variables: {
                        connectionArgs: {
                            first: this.pageSize,
                            after: lastCursor
                        },
                        teamSize: this.state.sizeFilter
                    },
                    updateQuery: (prev, {fetchMoreResult}) => {
                        if (!fetchMoreResult) return prev;
                        if (fetchMoreResult.getLeaderBoard.page.edges.length === 0) {
                            console.log("no more data");
                            this.setState({endReached: true})
                        }
                        return Object.assign(data.getLeaderBoard.page, prev, {
                            edges: [...prev.getLeaderBoard.page.edges, ...fetchMoreResult.getLeaderBoard.page.edges]
                        });
                    }
                })
            }}><Text>load more</Text></Button>
        )
    }

    renderLeaderBoard(leaderBoard, refetch, lbutton, userId) {
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
                        {leaderBoard.map((team, index) => {
                            return (
                                <TeamCard key={team.cursor} index={index} team={team} currentUserId={userId}/>
                            )
                        })}
                    </List>
                    {lbutton}
                </Content>
            </Container>
        )
    };


}


class TeamCard extends Component {

    state = {
        showJoinDialog: false,
    };

    render() {
        let {index, team, currentUserId} = this.props;
        let {node, cursor} = team;
        console.log(team)
        const teamAvatarUrl =
            node.avatar
                ? `${env.dev.API_IMG_URL}${node.avatar.filename}`
                : `${env.dev.API_IMG_URL}avatar_default.png`;
        const isMember = node.members.some((member) => (member.user.id === currentUserId) && member.isActive);
        const pendingRequest = node.members.some((member) => (member.user.id === currentUserId) && !member.isActive);

        const rightContent = isMember
            ? <Fragment>
                <Button transparent onPress={() => {
                    console.log("moooo")
                }}>
                    <Text>
                        Mitglied
                    </Text>
                </Button>
            </Fragment>
            : pendingRequest
                ? <Fragment>
                    <Button transparent onPress={() => {
                        console.log("moooo")
                    }}>
                        <Text>
                            Anfrage gesendet
                        </Text>
                    </Button>
                </Fragment>
                : team.node.closed ? <Fragment/> :<Fragment>
                    <Mutation mutation={REQUEST_JOIN_TEAM}
                              refetchQueries={[{query: LEADERBOARD}]}
                    >
                        {(requestJoinTeam) => {
                            return (
                                <Button transparent onPress={() => {
                                    this.setState({showJoinDialog: true})
                                }}>
                                    <Text>
                                        Beitreten
                                    </Text>
                                    <MaterialDialog
                                        title={`Join team ${team.node.name}?`}
                                        visible={this.state.showJoinDialog}
                                        onOk={() => {
                                            console.log(team)
                                            requestJoinTeam({
                                                variables: {
                                                    teamId: node.id
                                                }
                                            }).then((data) => {
                                                console.log(data)
                                            })
                                                .catch(error => {
                                                    console.log(error.message);
                                                })
                                            this.setState({showJoinDialog: false})
                                        }}
                                        onCancel={() => this.setState({showJoinDialog: false})}>
                                        <Text>
                                            Join team {team.node.name}?
                                        </Text>
                                    </MaterialDialog>
                                </Button>
                            )
                        }}
                    </Mutation>
                </Fragment>;

        const avatarAndPlaceIndicator = <View style={{width: 64, height: 64}}>
            <ImageBackground source={{uri: teamAvatarUrl}} style={{width: '100%', height: '100%'}}>
                <View style={{top: '50%', height: '50%'}}>
                    <BlurView tint="light" intensity={50} style={{ flex:1, justifyContent: 'center', alignItems: 'center'}}>
                      <Text>{node.place}</Text>
                    </BlurView>
                </View>
            </ImageBackground>
        </View>;
        return (
            <FSModal
                ref={(ref) => {
                    this.teamDetails = ref;
                }}
                body={<TeamDetailsModalContent
                    teamId={node.id}
                    requestModalClose={() => this.teamDetails.closeModal()}
                    ref={(ref) => {
                        this.teamDetailsContent = ref
                    }}
                />}
            >
            <ListItem onPress={() => {
                this.teamDetails.openModal()
            }}>
                <Left style={{flex:1}}>
                    {avatarAndPlaceIndicator}
                </Left>
                <Body style={{height: '100%', flex: 3, paddingLeft: 10}}>
                        <View>
                            <Text>{node.name}</Text>
                            <Text style={{color: material.textLight}}>{node.description}</Text>
                        </View>
                </Body>
                <Right style={{flex:1,height: '100%'}}>
                    {rightContent}
                </Right>
            </ListItem>
            </FSModal>
        )
    }
}
