import React from 'react';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import {FeedNavigation} from "./Feed/FeedScreen";
import {ChallengeNav, ChallengeViewsNav} from "./Challenges/ChallengeScreen";
import ProfileScreen from "./Profile/ProfileScreen";
import NotificationsScreen from "./Notifications/NotificationsScreen";
import TeamsNav from "./Competitve"
import material from '../../native-base-theme/variables/material';

export const AppNav = createMaterialBottomTabNavigator({
        FeedTab: {
            screen: FeedNavigation
        },
        NotificationsTab: {
            screen: NotificationsScreen
        },
        ChallengeTab: {
            screen: ChallengeNav
        },
        CompetitiveTab: {
            screen: TeamsNav
        },
        ProfileTab: {
            screen: ProfileScreen
        },
    }, {
        initialRouteName: 'ChallengeTab',
        activeTintColor: material.tabBarActiveTextColor,
        inactiveTintColor: material.tabBarTextColor,
        barStyle: {backgroundColor: material.tabDefaultBg},
        labeled: false,
        navigationOptions: {
            headerMode: 'screen'
        }
    }
);

