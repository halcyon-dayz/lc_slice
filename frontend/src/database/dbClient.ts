import { HttpLink, from, ApolloClient, InMemoryCache} from "@apollo/client";
import {onError} from "@apollo/client/link/error"

const baseUrl = "https://localhost:8000/graphql";


const httpLink = new HttpLink({
  uri: baseUrl
})

const errorLink = onError(({
  graphQLErrors, 
  networkError
}) => {
  if(graphQLErrors) {
    graphQLErrors.forEach(({message, locations, path}) => 
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ),
    );
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
})

export const databaseClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache()
});