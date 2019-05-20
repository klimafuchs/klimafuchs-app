import React, {Component, Fragment} from 'react';
import {Body, Button, Container, Fab, H1, Header, Icon, Left, List, ListItem, Right, Text, Title} from "native-base";
import {SafeAreaView} from "react-navigation";
import {ListView, StyleSheet} from "react-native";
import material from "../../../native-base-theme/variables/material";
import {connect} from "react-redux";
import {actions} from "../../persistence/actions/Actions";
import {store} from "../../persistence/store";
import {Notifications} from "expo";
import {MaterialDialog} from "react-native-material-dialog";
import {LocalizationProvider as L} from "../../localization/LocalizationProvider";

class NotificationsScreen extends Component {
    static navigationOptions = {
        title: 'Feed',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-notifications' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    state = {
        showDismissAllDialog: false
    };

    deleteRow(secId, rowId, rowMap) {
        console.log(rowMap[`${secId}${rowId}`].props)
        let {closeRow, body} = rowMap[`${secId}${rowId}`].props;
        let notificationId = body.props.notification.notificationId;
        this.props.dispatch({type: 'NOTIFICATIONS/DELETE', notificationId});
        Notifications.dismissNotificationAsync(notificationId);
        closeRow();
    }

    deleteAllNotifications = () => {
        let {notifications} = this.props;
        notifications.forEach((notification) => {
            this.props.dispatch({type: 'NOTIFICATIONS/DELETE', notificationId: notification.notificationId});
        })
        Notifications.dismissAllNotificationsAsync();
    };


    ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    renderList = (notifications) => {
        return (
            <List
                dataSource={this.ds.cloneWithRows(notifications)}
                rightOpenValue={-75}
                keyExtractor={(item, index) => '' + index}
                renderRow={(data) => <NotificationComponent notification={data}/>}
                renderRightHiddenRow={(data, secId, rowId, rowMap) =>
                    <Button full danger onPress={_ => this.deleteRow(secId, rowId, rowMap)}>
                        <Icon active name="trash"/>
                    </Button>}
            />
        )
    };


    render() {
        let {notifications} = this.props;
        return (
            <SafeAreaView style={styles.container} forceInset={{top: 'always'}}>
                <Header>
                    <Left style={{flex:1}}/>
                    <Body style={{paddingLeft: 10, flex:6}}>
                        <Title>Benachrichtigungen</Title>
                    </Body>
                </Header>

                <Container>
                    {notifications.length > 0 ?
                        this.renderList(notifications)
                        : <H1>Keine Benachrichtiungen</H1>}
                    <Fab style={{backgroundColor: material.brandInfo}} position="bottomRight"
                         onPress={() => this.setState({showDismissAllDialog: true})}>
                        <Fragment>
                            <Icon name="md-close" style={{color: material.brandLight}}/>
                            <MaterialDialog
                                visible={this.state.showDismissAllDialog}
                                cancelLabel={L.get('no')}
                                onCancel={() => {
                                    this.setState({showDismissAllDialog: false})
                                }}
                                okLabel={L.get('yes')}
                                onOk={async () => {
                                    this.deleteAllNotifications();
                                    this.setState({showDismissAllDialog: false});
                                }}
                                colorAccent={material.textLight}>
                                <Text style={{color: material.textLight}}>
                                    {L.get('hint_dismiss_all_notifications')}
                                </Text>
                            </MaterialDialog>
                        </Fragment>
                    </Fab>

                </Container>
            </SafeAreaView>
        );
    }
}

const NotificationComponent = ({notification: notification}) => {
    return (
        <ListItem style={styles.notificationListItem}>
            <Left style={{flex:1, width: '100%', height: '100%', justifyContent: 'flex-start', alignItems: 'flex-start',
            }}>
                <Icon active style={{fontSize: 27}} name={notification.data.icon || 'md-notifications-outline'}/>
            </Left>
            <Body style={{flex:6, paddingLeft:0, marginLeft:0}}>
                <Text style={{ paddingLeft:0, marginLeft:0}}>
                    TEST
                </Text>
                <Text style={{ paddingLeft:0, marginLeft:0}} note numberOfLines={2}>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Culpa, pariatur.
                </Text>
            </Body>
        </ListItem>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: material.brandInfo
    },
    notificationListItem: {
        padding: 10,
        paddingLeft: 20,
    }
});

const mapStateToProps = (state) => {
    const {notifications} = state;
    return notifications;
};

export default connect(mapStateToProps)(NotificationsScreen)