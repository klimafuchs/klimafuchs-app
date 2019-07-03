import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import NotificationReducer from './NotificationReducer';

export default combineReducers({
        auth: AuthReducer,
        notifications: NotificationReducer
    }
)