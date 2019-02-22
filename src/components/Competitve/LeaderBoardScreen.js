import React, {Fragment} from 'react';
import {RefreshControl, Text} from 'react-native';
import {Body, Button, Container, Content, Left, List, ListItem, Right, Thumbnail} from "native-base";
import {Query} from "react-apollo";
import {LEADERBOARD} from "../../network/Teams.gql";
import env from "../../env";

export class LeaderBoardScreen extends React.Component {
    static navigationOptions = {
        title: 'Leaderboard',
    };

    state = {
        refreshing: false,
        endReached: false,
        sizeFilter: "SOLO"
    };

    pageSize = 10;

    render() {
        return (
            <Container style={{flex: 1}}>
                <Query query={LEADERBOARD}
                       variables={{
                           connectionArgs: {first: this.pageSize},
                           teamSize: this.state.sizeFilter
                       }}
                >
                    {({loading, error, data, refetch, fetchMore}) => {
                        if (loading) {
                            return <Text>Loading...</Text>;
                        }
                        if (error) return <Text>{error.message}</Text>;
                        if (data) {
                            if (data.getLeaderBoard.page.edges.length > 0) {
                                return (
                                    <Fragment>
                                        {this.renderLeaderBoard(data.getLeaderBoard.page.edges, refetch)}
                                        {this.renderFetchMoreButton(data, loading, fetchMore)}
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
                        }


                    }}


                </Query>
            </Container>
        );


    }

    renderFetchMoreButton(data, loading, fetchMore) {
        return (
            <Button full light disabled={this.state.refreshing || this.state.endReached} onPress={() => {
                const lastCursor = data.getLeaderBoard.page.edges[data.getLeaderBoard.page.edges.length - 1].cursor;
                console.log(lastCursor)
                fetchMore({
                    variables: {
                        page: {
                            first: this.pageSize,
                            after: lastCursor
                        }
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

    renderLeaderBoard(leaderBoard, refetch) {
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
                                <TeamCard key={team.cursor} index={index} team={team}/>
                            )
                        })}
                    </List>
                </Content>
            </Container>
        )
    };
}


const TeamCard = ({index, team}) => {
    console.log(team);
    let {node, cursor} = team
    const teamAvatarUrl =
        node.avatar
            ? `${env.dev.API_IMG_URL}${node.avatar.filename}`
            : `${env.dev.API_IMG_URL}avatar_default.png`;
    return (
        <ListItem avatar>
            <Left>
                <Thumbnail source={{uri: teamAvatarUrl}}/>
            </Left>
            <Body style={{height: '100%'}}>
            <Text>{node.name} {node.score}</Text>
            </Body>
            <Right>
                <Text>
                    {index}
                </Text>
            </Right>
        </ListItem>
    )
}

