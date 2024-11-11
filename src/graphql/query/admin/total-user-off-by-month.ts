import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import Cookies from 'js-cookie'

const totalUserOffByMonthGql = gql`
  query UserOffByMonth {
    userOffByMonth
  }
`
export const userOffByMonth = () => {
    return client
        .query<{
            userOffByMonth: number
        }>({
            query: totalUserOffByMonthGql,
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
                data: r.data?.userOffByMonth,
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
