import {createUploadLink} from "apollo-upload-client/lib";
import {setContext} from "apollo-link-context";
import {AsyncStorage} from "react-native";
import {concat} from "apollo-link";
import ApolloClient from "apollo-client";
import {InMemoryCache} from "apollo-cache-inmemory";

const uri = "https://enviroommate.org/app-dev/api/gql";

const uploadLink = createUploadLink({
    uri: uri,
});

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
const link = concat(authLink, uploadLink);

client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
});

export default client;