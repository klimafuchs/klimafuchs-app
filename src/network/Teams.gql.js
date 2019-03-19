import gql from 'graphql-tag'

export const CREATE_TEAM = gql`
    mutation createTeam($name:String!, $avatarId:Int) {
        createTeam(team: {teamName:$name, mediaId:$avatarId}) {
            id,
            name,
            inviteId,
            avatar{
                filename            },
            members {
                id,
                user {
                    id,
                    screenName,
                    avatar {
                        filename                    }
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
                avatar {
                    filename,
                }
                score
            },
            isActive,
            isAdmin
        }
    }
`;

export const GET_MY_TEAM = gql`
    query getMyTeam($teamId: Int!) {
        getMyTeam(teamId: $teamId) {
            id
            name
            teamSize
            place
            score
            members {
                id
                user {
                    avatar {
                        filename
                    }
                    screenName
                }
                isActive
                isAdmin
            }
            avatar {
                filename
            }
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

export const LEADERBOARD = gql`
    query getLeaderBoard($connectionArgs:ConnectionArgs!, $teamSize:TeamSize! ) {
        getLeaderBoard(connectionArgs:$connectionArgs, teamSize:$teamSize ) {
            page {
                edges {
                    node {
                        id,
                        name,
                        score,
                        place,
                        avatar{filename},
                        teamSize,
                        members {
                            id
                        }
                    }
                    cursor
                }
            }
        }
    }
`;

export const CURRENT_USER_ID = gql`
    query getCurrentUserId {
        getCurrentUser{
            id
        }
    }
`

export const TeamSize = {
    SOLO: {name: 'Solo'},
    DUO: {name: 'Duo'},
    SMALL: {name: 'Small'},
    LARGE: {name: 'Large'},
    HUGE: {name: 'Huge'},
};