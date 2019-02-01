import React from 'react';
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import {FeedNavigation} from "./Feed/FeedScreen";
import {ChallengeViewsNav} from "./Challenges/ChallengeScreen";
import ProfileScreen from "./Profile/ProfileScreen";
import {NotificationsScreen} from "./Notifications/NotificationsScreen";
import {TeamsScreen} from "./Competitve/TeamsScreen";
import material from '../../native-base-theme/variables/material';

export const AppNav = createMaterialBottomTabNavigator({
        FeedTab: {
            screen: FeedNavigation
        },
    NotificationsTab: {
        screen: NotificationsScreen
    },
        ChallengeTab: {
            screen: ChallengeViewsNav
        },
    CompetitiveTab: {
        screen: TeamsScreen
    },
    ProfileTab: {
        screen: ProfileScreen
    },
    }, {

    activeTintColor: material.activeTab,
    inactiveTintColor: "#AFD4E6",
    barStyle: {backgroundColor: material.tabDefaultBg},
    }
);

