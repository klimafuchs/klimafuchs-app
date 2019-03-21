import React, {Component, Fragment} from 'react';
import {RefreshControl, Text, View} from 'react-native';
import {Body, Button, Container, Content, Form, Icon, List, ListItem, Picker, Right, Spinner} from "native-base";
import {Mutation, Query} from "react-apollo";
import {CURRENT_USER_ID, LEADERBOARD, REQUEST_JOIN_TEAM, TeamSize} from "../../network/Teams.gql";
import * as env from "../../env"
import {MaterialDialog} from 'react-native-material-dialog';

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
                : <Fragment>
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
                                        title="Join team {team.name}?"
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
                                            Join team {team.name}?
                                        </Text>
                                    </MaterialDialog>
                                </Button>
                            )
                        }}
                    </Mutation>
                </Fragment>

        return (
            <ListItem>
                <Body style={{height: '100%'}}>
                <View style={{flex: 1, flexDirection: 'row'}}>
                    <View>
                        <Text style={{color: '#008523'}}>Teamrang: </Text>
                        <Text>Teamname: </Text>
                    </View>
                    <View>
                        <Text>{node.place}</Text>
                        <Text>{node.name}</Text>
                    </View>
                </View>
                </Body>
                <Right style={{}}>
                    <Text> </Text>
                    {rightContent}
                </Right>
            </ListItem>
        )
    }
}
