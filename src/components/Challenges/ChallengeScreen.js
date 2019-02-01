import React from 'react';
import {Icon} from 'native-base';
import {SeasonPlanComponent} from "./SeasonPlanComponent";
import {SeasonComponent} from "./SeasonComponent";
import {HistoryComponent} from "./HistoryComponent";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import material from "../../../native-base-theme/variables/material";

//TODO refactor Components in challenge hierarchy to common singleQueryComponent?

export const ChallengeViewsNav = createMaterialBottomTabNavigator(
    {
        SeasonPlan: {
            screen: SeasonPlanComponent
        },
        Season: {
            screen: SeasonComponent
        },
        History: {
            screen: HistoryComponent
        }
    }, {
        navigationOptions: {
            title: 'Challenge',
            tabBarIcon: ({focused, tintColor}) => (
                <Icon name='star' style={{fontSize: 20, color: tintColor}}/>
            ),
        },
        barStyle: {backgroundColor: material.tabBgColor},
    }
);
