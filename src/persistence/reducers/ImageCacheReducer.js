import {handleActions} from 'redux-actions'
import {actions} from '../actions/Actions'

const defaultState = {

    imageCache: {
        loaded: {},
        loading: []
    }

};

const isLoading = (state, payload) => state.loading.filter((uri) => uri !== payload.uri);

export default handleActions({
    [actions.images.download]: (state, {payload}) => {
        if (state.loading.includes(payload)) return state;
        return {
            ...state,
            loading: [...state.loading, payload.uri]
        }
    },
    [actions.images.success]: (state, {payload}) => {
        const loading = isLoading(state, payload);
        const loaded = {...state.loaded, [payload.uri]: payload.local};
        return {loading, loaded}
    },
    [actions.images.error]: (state, {payload}) => {
        const loading = isLoading(state, payload);
        return {loading};
    },

}, defaultState, {});