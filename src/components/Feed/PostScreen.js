import React, {Component, Fragment} from 'react';
import {Body, Button, Container, Header, Icon, Left, Right, Text, Title} from "native-base";
import {Query} from "react-apollo";
import {LOAD_POST} from "../../network/Feed.gql";
import {AppLoading} from "expo";
import PostCard from "./PostComponent"


export default class PostScreen extends Component {
    static navigationOptions = ({navigation}) => {
        const title = navigation.getParam('postTitle');
        return (
            {
                header: <Fragment>
                    <Header>
                        <Left>
                            <Button transparent
                                    onPress={() => navigation.goBack()}>
                                <Icon name='arrow-back'/>
                            </Button>
                        </Left>
                        <Body>
                        <Title>{title}</Title>
                        </Body>
                        <Right/>
                    </Header>
                </Fragment>
            }
        )

    };

    render() {
        return (
            <Container>
                <Query query={LOAD_POST} variables={{postId: this.props.navigation.getParam('postId')}}>
                    {({loading, error, data, refetch}) => {
                        if (loading) return <AppLoading/>;
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

