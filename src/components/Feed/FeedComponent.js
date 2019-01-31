import React, {Component} from 'react';
import {Body, Button, Container, Content, Fab, Header, Icon, Left, Right, Text, Title} from "native-base";
import {Query} from "react-apollo";
import {LOAD_FEED} from "../../network/Feed.gql";
import {FlatList, RefreshControl} from "react-native";
import * as Constants from "expo";
import material from '../../../native-base-theme/variables/material';
import PostComponent from "./PostComponent";

export default class FeedComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {active: true, refreshing: false, endReached: false};
        this.pageSize = props.pageSize || 10;
    }

    render() {
        return (
            <Container>
                <Header style={{paddingTop: Constants.statusBarHeight}}>
                    <Left/>
                    <Body>
                    <Title>News</Title>
                    </Body>
                    <Right/>
                </Header>

                <Query query={LOAD_FEED}
                       variables={{page: {first: this.pageSize, after: ""}}}
                       fetchPolicy="cache-and-network"
                >
                    {({loading, error, data, refetch, fetchMore}) => {
                        let spinner;
                        if (loading) {
                            spinner = <Text>Loading...</Text>
                        } else {
                            spinner = <Text>More</Text>
                        }
                        if (error) return <Text>`Error ${error.message}`</Text>;
                        return (

                            <Content refreshControl={<RefreshControl
                                refreshing={this.state.refreshing || loading}
                                onRefresh={() => refetch()}
                            />
                            }>
                                <FlatList
                                    data={data.paginatedPosts ? data.paginatedPosts.page.edges : []}
                                    keyExtractor={(item, index) => item.node.id.toString()}
                                    renderItem={({item}) => {
                                        const post = item.node;
                                        return (
                                            <PostComponent key={post.id} post={post}
                                                           navigateToDetailedView={function () {
                                                               this.props.navigation.navigate('Post', {postId: post.id})
                                                           }.bind(this)}/>
                                        )
                                    }
                                    }
                                />
                                {data.paginatedPosts && this.state.endReached
                                    ? <Button full light disabled>
                                        <Text>Keine weiteren Einträge</Text>
                                    </Button>
                                    : <Button full light disabled={loading} onPress={() => {
                                        const lastCursor = data.paginatedPosts.page.edges[data.paginatedPosts.page.edges.length - 1].cursor;
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
                                                if (fetchMoreResult.paginatedPosts.page.edges.length === 0) {
                                                    console.log("no more data");
                                                    this.setState({endReached: true})
                                                }
                                                return Object.assign(data.paginatedPosts.page, prev, {
                                                    edges: [...prev.paginatedPosts.page.edges, ...fetchMoreResult.paginatedPosts.page.edges]
                                                });
                                            }
                                        })
                                    }}>{spinner}</Button>
                                }
                            </Content>

                        )
                    }
                    }
                </Query>
                <Fab style={{backgroundColor: material.brandPrimary}} position="bottomRight"
                     onPress={() => this.props.navigation.navigate('NewPost')}>
                    <Icon name="md-add"/>
                </Fab>
            </Container>
        )
            ;
    }
}

