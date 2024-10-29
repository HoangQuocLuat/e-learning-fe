import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Tuition } from '@models/tuition'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

const tuitionPaginationGql = gql`
  query TuitionPagination($page: Int!, $limit: Int!, $orderBy: String, $search: Map) {
    tuitionPagination(page: $page, limit: $limit, order_by: $orderBy, search: $search) {
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
      }
    }
  }
`

export const tuitionPagination: BaseApiFunction<Tuition[]> = p => {
    return client
        .query<{
            tuitionPagination: BaseResponseData<Tuition[]>
        }>({
            query: tuitionPaginationGql,
            fetchPolicy: 'no-cache',
            variables: { page: p?.page, limit: p?.limit, search: p?.search },
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
          console.log(r.data.tuitionPagination)
            return {
                success: true,
                data: (r.data.tuitionPagination.rows ?? []).map(Tuition.fromJson),
                paging: Pagination.fromJson(r.data.tuitionPagination.paging),
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
