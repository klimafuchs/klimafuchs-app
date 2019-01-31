import React from 'react';
import {Text, View} from 'react-native';
import {Icon} from "native-base";

export class TeamsScreen extends React.Component {
    static navigationOptions = {
        title: 'Teams',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='md-people' style={{fontSize: 20, color: tintColor}}/>
        ),
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>TeamsScreen</Text>
            </View>
        );
    }

};

