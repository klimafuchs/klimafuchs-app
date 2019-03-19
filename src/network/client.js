import {createUploadLink} from "apollo-upload-client/lib";
import {setContext} from "apollo-link-context";
import {AsyncStorage} from "react-native";
import {concat} from "apollo-link";
import ApolloClient from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";
import {persistCache} from 'apollo-cache-persist';
import {onError} from "apollo-link-error";

const uri = "https://enviroommate.org/app-dev/api/gql";

const uploadLink = createUploadLink({
    uri: uri,
});

const cache = new InMemoryCache();

persistCache({
    cache,
    storage: AsyncStorage,
    trigger: "background",
    maxSize: 1048576 * 10, // 10MB
    debug: !!__DEV__
}).catch(err => console.error(err));

const authLink = setContext(async (_, {headers}) => {
    // get the authentication token from local storage if it exists
    const token = await AsyncStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const errorLink = onError(({graphQLErrors, networkError}) => {
    if (graphQLErrors)
        graphQLErrors.map(({message, locations, path}) =>
            console.log(
                `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
            ),
        );

    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const link = concat(authLink, uploadLink);

const client = new ApolloClient({
    link,
    cache: new InMemoryCache()
});

export default client;