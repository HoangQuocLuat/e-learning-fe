import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import Cookies from 'js-cookie'

const revenueByMonthCurentGpl = gql`
  query RevenueByMonthCurent {
    revenueByMonthCurent
  }
`
export const revenueByMonthCurent = () => {
    return client
        .query<{
            revenueByMonthCurent: number
        }>({
            query: revenueByMonthCurentGpl,
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
                data: r.data?.revenueByMonthCurent,
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
