import gql from 'graphql-tag'

export default gql`
    query myMedia {
        myMedia {
            id
            filename
            mimetype
            path
        }
    }
`