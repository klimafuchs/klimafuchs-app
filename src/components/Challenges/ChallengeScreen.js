import React, {Fragment} from 'react';
import {Body, Header, Icon, Left, Right, Title} from 'native-base';
import {SeasonPlanComponent} from "./SeasonPlanComponent";
import {SeasonComponent} from "./SeasonComponent";
import {HistoryComponent} from "./HistoryComponent";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import material from "../../../native-base-theme/variables/material";
import {createMaterialTopTabNavigator, createStackNavigator} from 'react-navigation';

//TODO refactor Components in challenge hierarchy to common singleQueryComponent?

export const ChallengeViewsNav = createMaterialTopTabNavigator(
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
            header: (
                <Fragment>
                    <Header transparent style={{backgroundColor: material.brandInfo}}>
                        <Left/>
                        <Body>
                            <Title>Challenges</Title>
                        </Body>
                        <Right/>
                    </Header>
                </Fragment>
            ),
            headerMode: 'screen',

            initialRouteName: 'SeasonPlan'
        },
        tabBarOptions: {
            style: {
                backgroundColor: material.brandInfo,
            },
            indicatorStyle: {
                backgroundColor: material.brandLight,
            }
        },
    }
);


export const ChallengeNav = createStackNavigator(
    {
        Main: {
            screen: ChallengeViewsNav,
        },

    }, {
        navigationOptions: {
            title: 'Challenges',
            tabBarIcon: ({focused, tintColor}) => (
                <Icon name='star' style={{fontSize: 20, color: tintColor}}/>
            ),


            headerMode: 'screen'

        },

    }
);
