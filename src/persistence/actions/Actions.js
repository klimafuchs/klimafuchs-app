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
    IMAGES: {
        FETCH: undefined,
        DOWNLOAD: undefined,
        SUCCESS: undefined,
        ERROR: undefined,
    },
});



