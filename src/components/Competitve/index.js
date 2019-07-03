import React, {Fragment} from 'react';

import {createMaterialTopTabNavigator, createStackNavigator} from 'react-navigation';
import {Body, Header, Icon, Left, Right, Title} from "native-base";
import material from "../../../native-base-theme/variables/material";
import {TeamsScreen} from "./TeamsScreen";
import {LeaderBoardScreen} from "./LeaderBoardScreen";
import CreateTeamScreen from "./CreateTeamScreen";
import {EditTeamScreen} from "./EditTeamScreen";



const TeamsNav = createStackNavigator(
    {
        Main: {
            screen: createMaterialTopTabNavigator(
                {
                    Teams: {
                        screen: LeaderBoardScreen
                    },
                    MyTeams: {
                        screen: TeamsScreen
                    },
                }, {
                    navigationOptions: {
                        header: (
                            <Fragment>
                                <Header transparent style={{backgroundColor: material.brandInfo}}>
                                    <Left/>
                                    <Body>
                                        <Title>Teams</Title>
                                    </Body>
                                    <Right/>
                                </Header>
                            </Fragment>
                        ),
                    },
                    headerMode: 'screen',

                    tabBarOptions: {
                        style: {
                            backgroundColor: material.brandInfo,
                        },
                        indicatorStyle: {
                            backgroundColor: material.brandLight,
                        }
                    },
                    initialRouteName: 'Teams',

                },

),
        },

        CreateTeam: {
            screen: CreateTeamScreen
        },
        EditTeam: {
            screen: EditTeamScreen
        }

    }, {
        navigationOptions: {
            title: 'Teams',
            tabBarIcon: ({focused, tintColor}) => (
                <Icon name='md-people' style={{fontSize: 20, color: tintColor}}/>
            ),
            header: null
        },

    }
);
export default TeamsNav;