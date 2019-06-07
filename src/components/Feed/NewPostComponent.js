import React, {Component, Fragment} from 'react';
import {StyleSheet, View} from 'react-native';
import {
    Body,
    Button,
    Container,
    Content,
    Form,
    Header,
    Icon,
    Input,
    Item,
    Label,
    Left,
    Right,
    Text,
    Textarea,
    Title
} from "native-base";
import {Mutation} from "react-apollo";
import {ADD_POST} from "../../network/Feed.gql";
import UploadImage from "../Common/UploadImage";
import {SafeAreaView} from "react-navigation";
import material from "../../../native-base-theme/variables/material";

export default class NewPostComponent extends Component {
    static navigationOptions = ({navigation}) => {
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
                        <Title>Neuer Beitrag</Title>
                        </Body>
                        <Right/>
                    </Header>
                </Fragment>
            }
        )

    };

    constructor(props) {
        super(props);
        this.state = {title: '', body: '', ytId: '', mediaId: undefined}
    }

    addHeader = (header) => {
        console.log(header)
        this.setState({mediaId: header.mediaId, ytId: header.ytId})
    }

    render() {
        return (
            <SafeAreaView style={styles.container} forceInset={{top: 'always'}}>

            <Container >

                <Header>
                    <Left>
                        <Button transparent
                                onPress={() => this.props.navigation.goBack()}>
                            <Icon name='arrow-back'/>
                        </Button>
                    </Left>
                    <Body>
                        <Title>Neuer Beitrag</Title>
                    </Body>
                    <Right/>
                </Header>
                <Content style={{backgroundColor: '#fff', paddingLeft: 5, paddingRight: 5}}>
                    <Mutation mutation={ADD_POST}>
                        {(addPost, {data}) => (
                            <Form style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                                <MediaInput onSelected={this.addHeader}/>
                                <Item floatingLabel>
                                    <Label>Titel</Label>
                                    <Input name="title" onChangeText={(text) => this.setState({title: text})}
                                           value={this.state.title}/>
                                </Item>
                                <Textarea rowSpan={5}
                                          name="body"
                                          bordered
                                          placeholder="Text eingeben"
                                          onChangeText={(text) => this.setState({body: text})}
                                          value={this.state.body}
                                          style={{width: '100%'}}
                                />
                                <Button primary block style={{
                                    marginLeft: '30%',
                                    marginRight: '30%',
                                    marginTop: 20,
                                    elevation: 1,
                                }}
                                        onPress={() => {
                                            console.log({
                                                variables: {
                                                    title: this.state.title,
                                                    body: this.state.body,
                                                    mediaId: this.state.mediaId
                                                }
                                            });
                                            addPost({
                                                variables: {
                                                    title: this.state.title,
                                                    body: this.state.body,
                                                    mediaId: this.state.mediaId
                                                }
                                            });
                                            this.props.navigation.navigate('Feed')
                                        }}>
                                    <Text>Posten</Text>
                                </Button>
                            </Form>
                        )}
                    </Mutation>
                </Content>
            </Container>
            </SafeAreaView>

        )
    }
}

class MediaInput extends Component {
    state = {
        awaitsMedia: false,
        awaitsYt: false,
    };

    reset = () => {
        if (this.props.onCancel) this.props.onCancel();
        this.setState({
            awaitsMedia: false,
            awaitsYt: false,
        })
    }

    render() {
        return (
            <View style={{height: 200, width: '100%'}}>
                <UploadImage placeholder={'#'} onCancel={this.reset} onUploadFinished={(media) => {
                    if (this.props.onSelected) {

                        this.props.onSelected({mediaId: media.id})
                    }
                }}/>
            </View>
        )

    }


}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: material.brandInfo
    }
});
