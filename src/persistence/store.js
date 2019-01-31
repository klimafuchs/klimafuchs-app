import {applyMiddleware, createStore} from "redux";
import axios from 'axios';
import axiosMiddleWare from 'redux-axios-middleware';
import rootReducer from './reducers';
import {AsyncStorage} from 'react-native';


const token = async() => await AsyncStorage.getItem('token');
const client = axios.create({
    baseURL: 'http://10.0.2.2:3000/api',
    responseType: 'json',
    headers: token() ? {
        common: {
            'Authorization': "bearer " + token()
        }
    } : {}
});

const initialState = {};
const middleware = [axiosMiddleWare(client)];

const store = createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware)
);

export default store;
