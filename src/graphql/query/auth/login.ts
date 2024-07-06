import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'

const logInGql = gql`
  query logIn($user_name: String!, $password: String!) {
    authAdminLogin(user_name: $user_name, password: $password) {
      access_token
      refresh_token
    }
  }
`

export const logIn: BaseApiFunction<string, { userName: string; password: string }> = p => {
  console.log('Input:', p.input);
  return client
    .query<{
      authAdminLogin: BaseResponseData<{ access_token: string; refresh_token: string }>
    }>({
      query: logInGql,
      fetchPolicy: 'no-cache',
      variables: { user_name: p.input?.userName, password: p.input?.password },
    })
    .then(r => {
      return {
        success: true,
        data: r.data.authAdminLogin.access_token,
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
