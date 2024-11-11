import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import Cookies from 'js-cookie'

const totalUserGql = gql`
  query UserTotal {
    userTotal 
  }
`
export const totalUser = () => {
    return client
        .query<{
            userTotal: number
        }>({
            query: totalUserGql,
            fetchPolicy: 'no-cache',
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: r.data?.userTotal,
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
