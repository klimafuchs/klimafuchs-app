import {createActions} from 'redux-actions'

export const actions = createActions({

    AUTH: {
        LOGIN: (userName, password) => ({userName, password}),
        REGISTER: (userName, screenName, password, confirm_password, invite) => ({
            userName,
            screenName,
            password,
            confirm_password,
            invite
        }),
        SUCCESS: (response) => response,
        ERROR: (error) => error
    },
    NOTIFICATIONS: {
        RECEIVE: notification => notification,
        DELETE: notificationId => notificationId,
    }
});



