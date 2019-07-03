import {applyMiddleware, createStore} from "redux";
import axios from 'axios';
import axiosMiddleWare from 'redux-axios-middleware';
import rootReducer from './reducers';
import {AsyncStorage} from 'react-native';
import { persistStore, persistReducer } from 'redux-persist'
import ExpoFileSystemStorage from "redux-persist-expo-filesystem"

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

const persistConfig = {
    key: 'root',
    storage: ExpoFileSystemStorage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const initialState = {};
const middleware = [axiosMiddleWare(client)];

export const store = createStore(
    persistedReducer,
    initialState,
    applyMiddleware(...middleware)
);

export const persistor = persistStore(store);

