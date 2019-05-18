import React, {Component} from 'react';
import {Body, Button, Container, H1, Header, Icon, Left, List, ListItem, Right, Text, Title} from "native-base";
import {SafeAreaView} from "react-navigation";
import {ListView, StyleSheet} from "react-native";
import material from "../../../native-base-theme/variables/material";
import {connect} from "react-redux";
import {actions} from "../../persistence/actions/Actions";

class NotificationsScreen extends Component {
    static navigationOptions = {
        title: 'Feed',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-notifications' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    deleteRow(secId, rowId, rowMap) {
        rowMap[`${secId}${rowId}`].props.closeRow();
        console.log(rowMap[`${secId}${rowId}`].props)
    }


    renderList = (notifications) => {
        const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        return (
        <List
            dataSource ={ds.cloneWithRows(notifications)}
            rightOpenValue={-75}
            keyExtractor={(item, index) => ''+index}
            renderRow={(data) => <NotificationComponent notification={data}/>}
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                    <Icon active name="trash" />
                </Button>}
        />
    )};


    render() {
        let {notifications} = this.props;
        return (
            <SafeAreaView style={styles.container} forceInset={{top: 'always'}}>
                <Header>
                    <Left/>
                    <Body>
                        <Title>Benachrichtigungen</Title>
                    </Body>
                    <Right/>
                </Header>

                <Container>
                    {notifications.length > 0 ?
                        this.renderList(notifications)
                        : <H1>Keine Benachrichtiungen</H1>}
                </Container>
            </SafeAreaView>
        );
    }
}

const NotificationComponent = ({notification: notification}) => {
    return(
        <ListItem thumbnail>
            <Left>
                <Icon active name={notification.data.icon || 'md-notifications-outline'} />
            </Left>
            <Body>
                <Text>
                    {notification.data.title}
                </Text>
                {notification.data.body && <Text note numberOfLines={2}>
                    {notification.data.body}
                </Text>}
            </Body>
        </ListItem>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: material.brandInfo
    }
});

const mapStateToProps = (state) => {
    const {notifications} = state;
    return notifications;
};

export default connect(mapStateToProps)(NotificationsScreen)