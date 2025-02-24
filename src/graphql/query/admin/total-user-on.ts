import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import Cookies from 'js-cookie'

const totalUserOnGql = gql`
  query UserOnTotal {
    userOnTotal
  }
`
export const totalUserOn = () => {
    return client
        .query<{
            userOnTotal: number
        }>({
            query: totalUserOnGql,
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
                data: r.data?.userOnTotal,
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
