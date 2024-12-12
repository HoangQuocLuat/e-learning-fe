import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Tuition } from '@models/tuition'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

// GraphQL Query
const tuitionPaginationByMonthGql = gql`
  query TuitionPaginationByMonth($month: String!, $year: String!, $page: Int!, $limit: Int!, $orderBy: String, $search: Map) {
    tuitionPaginationByMonth(month: $month, year: $year, page: $page, limit: $limit, order_by: $orderBy, search: $search) {
      paging {
        current_page
        limit
        total_pages
        total
      }
      rows {
        id
        total_fee
        discount
        paid_amount
        remaining_fee
        month
        user {
          id
          name
        }
      }
    }
  }
`

// API Function
export const tuitionPaginationByMonth = (p: { month: string; year: string; page: number; limit: number; orderBy?: string; search?: Record<string, any> }) => {
  return client
    .query<{
      tuitionPaginationByMonth: BaseResponseData<Tuition[]>
    }>({
      query: tuitionPaginationByMonthGql,
      fetchPolicy: 'no-cache',
      variables: {
        month: p.month,
        year: p.year,
        page: p.page,
        limit: p.limit,
        orderBy: p.orderBy,
        search: p.search,
      },
      context: {
        headers: {
          token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
        },
      },
    })
    .then(r => {
      return {
        success: true,
        data: (r.data?.tuitionPaginationByMonth?.rows ?? []).map(Tuition.fromJson),
        paging: Pagination.fromJson(r.data?.tuitionPaginationByMonth?.paging),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
