import gql from 'graphql-tag'

export const LOAD_FEED = gql`
    query FeedPage($page:ConnectionArgs!) {
        paginatedPosts (connectionArgs:$page) {
            page {
                edges {
                    node {
                        id,
                        title,
                        author {
                            screenName,
                            avatar {filename}
                        },
                        body,
                        sentiment,
                        commentCount,
                        currentUserLikesPost,
                        dateCreated,
                        image {
                            id, path, filename, width, height
                        },
                        ytId
                    },
                    cursor
                }
            },
            pageData {
                count,
                limit,
                offset
            }
        }
    }
`;

export const LOAD_POST = gql`
    query Post($postId: Int!){
        post(postId: $postId) {
            id,
            title,
            body,
            author {
                screenName, avatar {filename}
            },
            sentiment,
            dateCreated,
            commentCount,
            image {
                id, path, filename, width, height
            },
            ytId,
            currentUserLikesPost,
            comments {
                id,
                author {
                    screenName
                },
                body,
                children {
                    id
                },
                parent {
                    id
                },
                sentiment,
                dateCreated,
                currentUserLikesComment
            }
        }
    }
`;

export const ADD_POST = gql`
    mutation addPost($title: String!, $body: String!, $mediaId: Int){
        addPost(post: {
            title: $title
            body: $body
            mediaId: $mediaId
        }){
            title, body
        }
    }
`;

export const LIKE_POST = gql`mutation like($postId:Int!){
    likePost(postId:$postId){
        id,sentiment, currentUserLikesPost
    }
}
`;

export const UNLIKE_POST = gql`mutation unlike($postId:Int!){
    unlikePost(postId:$postId){
        id,sentiment, currentUserLikesPost
    }
}
`;

export const LIKE_COMMENT = gql`mutation likeComment($commentId:Int!){
    likeComment(commentId:$commentId){
        id,sentiment, currentUserLikesComment
    }
}
`;

export const UNLIKE_COMMENT = gql`mutation unlikeComment($commentId:Int!){
    unlikeComment(commentId:$commentId){
        id,sentiment, currentUserLikesComment
    }
}
`;

export const ADD_COMMENT = gql`
    mutation AddComment($body:String!, $postId:Int!, $parentId:Int) {
        addComment(comment: {body:$body, post:$postId, parent:$parentId}) {
            id,
            author {
                screenName,
                avatar {filename}
            },
            body,
            children {
                id
            },
            parent {
                id
            },
            sentiment,
            dateCreated,
            currentUserLikesComment
        }
    }
`;