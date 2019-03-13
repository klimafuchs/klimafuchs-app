import {AsyncStorage} from "react-native";
import {handleActions} from 'redux-actions'
import {actions} from '../actions/Actions'

const token = async() => await AsyncStorage.getItem('token');

const defaultState = {
    userInfo: {
        token: '',
        userId: '',
    },
};

export default handleActions({
    [actions.auth.login]: (state, payload) => undefined,
    [actions.auth.register]: (state, payload) => undefined,
    [actions.auth.success]: (state, payload) => undefined,
    [actions.auth.error]: (state, payload) => undefined,

}, defaultState, {});