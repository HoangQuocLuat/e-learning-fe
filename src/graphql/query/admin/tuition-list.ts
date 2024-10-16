import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Tuition } from '@models/tuition'
import Cookies from 'js-cookie'

const tuitionListGql = gql`
  query TuitionListByMonth($month: String!, $year: String!) {
    tuitionListByMonth(month: $month, year: $year) {
        id
        total_fee
        discount
        remaining_fee
        paid_amount
        user {
            id
            name
        }
    }
  }
`
export const tuitionList = (p: { month: string, year: string }) => {
    return client
        .query<{
            tuitionListByMonth: BaseResponseData<Tuition[]>
        }>({
            query: tuitionListGql,
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
                data: r.data?.tuitionListByMonth,
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
