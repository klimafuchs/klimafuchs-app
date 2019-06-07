import React, {Component} from 'react';
import {Body, Container, Content, Header, Left, Title, Text} from "native-base";
import {SafeAreaView} from "react-navigation";
import {StyleSheet} from "react-native";
import material from "../../../native-base-theme/variables/material";

export class EditTeamScreen extends Component {
    render() {
        return (
            <SafeAreaView style={styles.container} forceInset={{top: 'always'}}>
                <Container>
                    <Header>
                        <Left/>
                        <Body>
                            <Title>
                                Edit Team
                            </Title>
                        </Body>
                    </Header>
                    <Content style={{flex: 1}}>

                        <Text>Hello</Text>

                    </Content>
                </Container>
            </SafeAreaView>

        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: material.brandInfo
    }
})