import React from 'react';
import {Container, Icon} from 'native-base';
import {SeasonPlanComponent} from "./SeasonPlanComponent";
import {SeasonComponent} from "./SeasonComponent";
import {HistoryComponent} from "./HistoryComponent";
import {createMaterialBottomTabNavigator} from "react-navigation-material-bottom-tabs";
import material from "../../../native-base-theme/variables/material";

//TODO refactor Components in challenge hierarchy to common singleQueryComponent?

const ChallengeViewsNav = createMaterialBottomTabNavigator(
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
        barStyle: {backgroundColor: material.tabBgColor},
    }
)

class ChallengeScreen extends React.Component {
    static navigationOptions = {
        title: 'Challenge',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='star' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    render() {
        return (
            <Container>
                <ChallengeViewsNav/>
            </Container>
        );
    }

};

export default ChallengeScreen;
