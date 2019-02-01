import React from 'react';
import {createStackNavigator} from "react-navigation";
import {Icon,} from "native-base";
import FeedComponent from './FeedComponent';
import NewPostComponent from './NewPostComponent';
import PostScreen from './PostScreen';

export const defaultAvatar = (process.env.API_IMG_URL || "https://enviroommate.org/app-dev/img/") + "avatar_default.png"; //TODO replace default avatar with local file

export const FeedNavigation = createStackNavigator({
    Feed: {
        screen: FeedComponent
    },
    Post: {
        screen: PostScreen
    },
    NewPost: {
        screen: NewPostComponent
    }
}, {
    navigationOptions: {
        title: 'Feed',
        tabBarIcon: ({focused, tintColor}) => (
            <Icon name='list' style={{fontSize: 20, color: tintColor}}/>
        ),
    },
    initialRouteName: 'Feed',
});

