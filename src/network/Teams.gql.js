import gql from 'graphql-tag'

export const CREATE_TEAM = gql`
    mutation createTeam($name:String!, $avatarId:Int, $description:String) {
        createTeam(team: {teamName:$name, mediaId:$avatarId, teamDescription:$description}) {
            id,
            name,
            description,
            inviteId,
            avatar{
                filename            },
            members {
                id,
                user {
                    id,
                    screenName,
                    avatar {
                        filename
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
            description
            members {
                id
                user {
                    id,
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
    mutation requestJoinTeam($teamId:Int!){
        requestJoinTeam(teamId:$teamId) {
            id,
            user {
                id
            }
            isActive,
            isAdmin
        }
    }
`;

export const CONFIRM_MEMBER = gql`
    mutation confirmMember($membershipId:Int!) {
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
                        description
                        members {
                            id,
                            user {
                                id
                            }
                            isActive,
                            isAdmin
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
    SOLO: {name: 'Solo', value: 'SOLO'},
    DUO: {name: 'Duo', value: 'DUO'},
    SMALL: {name: 'Small', value: 'SMALL'},
    LARGE: {name: 'Large', value: 'LARGE'},
    HUGE: {name: 'Huge', value: 'HUGE'},
};