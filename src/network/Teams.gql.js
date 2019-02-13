import gql from 'graphql-tag'

export const CREATE_TEAM = gql`
    mutation createTeam($name:String!, $avatarId:Int) {
        createTeam(team: {teamName:$name, mediaId:$avatarId}) {
            id,
            name,
            inviteId,
            avatar{
                path,
                mimetype,
                width,
                height
            },
            members {
                id,
                user {
                    id,
                    screenName,
                    avatar {
                        path,
                        mimetype,
                        width,
                        height
                    }
                },
                dateCreated,
                isActive,
                activationDate,
                isAdmin
            },
            score
        }
    }
`;

export const MY_MEMBERSHIPS = gql`
    query {
        myMemberships{
            id,
            team {
                id,
                name,
                score
            },
            isActive,
            isAdmin
        }
    }
`;

export const GET_MY_TEAM = gql`
    query ($teamId:Int!){
        getMyTeam(teamId:$teamId){
            id,
            name,
            members {
                user {
                    avatar,
                    screenName,
                }
                isActive,
                isAdmin
            },
            score,
            avatar
        }
    }
`;

export const REQUEST_JOIN_TEAM = gql`
    mutation ($teamId:Int!){
        requestJoinTeam(teamId:$teamId) {
            id
        }
    }
`;

export const CONFIRM_MEMBER = gql`
    mutation ($membershipId:Int!) {
        confirmMember(membershipId:$membershipId) {
            id
        }
    }
`;