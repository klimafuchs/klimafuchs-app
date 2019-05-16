import gql from 'graphql-tag'

export const UPDATE_PROFILE = gql`
    mutation updateProfile($userName: String, $screenName: String, $avatarId: Int){
        updateProfile(userName: $userName, screenName: $screenName, avatarId: $avatarId) {
            id,
            userName,
            screenName,
            avatar {filename},
        }
    }
`;

export const CHANGE_PASSWORD = gql`
    mutation changePassword($oldPassword: String!, $newPassword: String!){
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword) {
            id
        }
    }
`;

export const CURRENT_USER = gql`
    query getCurrentUser {
        getCurrentUser {
            id,
            userName,
            screenName,
            avatar {filename},
        }
    }
`;

export const IS_SUBSCRIBED_TO_NOTIFICATIONS = gql`
    query isSubscribed {
        isSubscribed {
            id
            pushToken
        }
    }
`;

export const SUBSCRIBE_TO_NOTIFICATIONS = gql`
    mutation subscribe($pushToken: String!){
        subscribe(pushToken: $pushToken) {
            id
        }
    }
`;

export const UNSUBSCRIBE_FROM_NOTIFICATIONS = gql`
    mutation unsubscribe {
        unsubscribe {
            pushToken
        }
    }
`;

export const TEST_NOTIFICATION = gql`
    query testNptification {
        testNotification 
    }
`;