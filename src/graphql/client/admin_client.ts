import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { getAuthenToken } from '@commons/cookies'

const httpLink = createHttpLink({
  uri: "http://localhost:8989/api/v1/graphql/admin"
})

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = headers?.token ?? getAuthenToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

export default client
