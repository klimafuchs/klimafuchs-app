import React, {Fragment} from 'react';

import {createMaterialTopTabNavigator, createStackNavigator} from 'react-navigation';
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {TeamsScreen} from "./TeamsScreen";
import {LeaderBoardScreen} from "./LeaderBoardScreen";


const TeamsNav = createMaterialTopTabNavigator(
    {
        Teams: {
            screen: LeaderBoardScreen
        },
        MyTeams: {
            screen: TeamsScreen
        }
    }, {
        navigationOptions: {
            header: (
                <Fragment>
                    <Header transparent style={{backgroundColor: material.brandPrimary}}>
                        <Left/>
                        <Body>
                        <Title>Teams</Title>
                        </Body>
                        <Right/>
                    </Header>
                </Fragment>
            ),
            headerMode: 'screen'
        },
        tabBarOptions: {
            style: {
                backgroundColor: material.brandPrimary,
            },
            indicatorStyle: {
                backgroundColor: material.brandLight,
            }
        },
        initialRouteName: 'Teams',
    }
);

const HeaderProxyThing = createStackNavigator(
    {
        Main: {
            screen: TeamsNav,
        },

    }, {
        navigationOptions: {
            title: 'Teams',
            tabBarIcon: ({focused, tintColor}) => (
                <Icon name='md-people' style={{fontSize: 20, color: tintColor}}/>
            ),
            headerMode: 'screen'

        },

    }
);
export default HeaderProxyThing;