import React from 'react';
import {Text, View} from 'react-native';

export class LeaderBoardScreen extends React.Component {
    static navigationOptions = {
        title: 'Team',
    };

    render() {
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <Text>TeamsScreen</Text>
            </View>
        );
    }
}

