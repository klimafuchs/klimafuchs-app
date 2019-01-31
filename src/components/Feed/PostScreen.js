import React, {Component} from 'react';
import {Container, Text} from "native-base";
import {Query} from "react-apollo";
import {LOAD_POST} from "../../network/Feed.gql";
import Expo from "expo";
import PostCard from "./PostComponent"


export default class PostScreen extends Component {
    render() {
        return (
            <Container>
                <Query query={LOAD_POST} variables={{postId: this.props.navigation.getParam('postId')}}>
                    {({loading, error, data, refetch}) => {
                        if (loading) return <Expo.AppLoading/>;
                        if (error) {
                            console.log(error);
                            return <Text>`Error ${error.message}`</Text>;
                        }
                        return (
                            <PostCard post={data.post} commentRefetch={refetch}
                                      close={() => this.props.navigation.navigate('Feed')}/>
                        )
                    }}
                </Query>
            </Container>
        );
    }
}

