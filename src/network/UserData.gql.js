import gql from 'graphql-tag'

//TODO add ńotification setting on here
export const UPDATE_PROFILE = gql`
    mutation updateProfile($userName: String, $screenName: String, $avatarId: Int){
        updateProfile(userName: $userName, screenName: $screenName, avatarId: $avatarId) {
            userName,
            screenName,
            avatar {path},
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
            userName,
            screenName,
            avatar {path},
        }
    }
`;