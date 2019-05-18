import {handleActions} from 'redux-actions'
import {actions} from '../actions/Actions'

const defaultState = {
    notifications: []
};

export default handleActions({
    [actions.notifications.receive]: (state, action) => {
        console.log(state, action);
        return ({
            notifications: [action.notification, ...state.notifications]
        })},
            [actions.notifications.delete]: (state, action) => ({
        notifications: state.notifications.filter(notification => notification !== action.notification)
    })
}, {
    notifications: []
});