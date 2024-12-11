import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import Cookies from 'js-cookie'

const revenueByMonthGql = gql`
  query RevenueByMonthCurent($month: String!, $year: String!) {
    revenueByMonthCurent(month: $month, year: $year)
  }
`

export const revenueByMonth = (p: { month: string, year: string }) => {
    return client
        .query<{
            revenueByMonthCurent: number
        }>({
            query: revenueByMonthGql,
            fetchPolicy: 'no-cache',
            variables: { month: p.month, year: p.year },
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: r.data?.revenueByMonthCurent,
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
