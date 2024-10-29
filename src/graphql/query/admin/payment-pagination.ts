import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Payment } from '@models/payment'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

const paymentPaginationGql = gql`
  query PaymentPagination($page: Int!, $limit: Int!, $orderBy: String, $search: Map) {
    paymentPagination(page: $page, limit: $limit, order_by: $orderBy, search: $search) {
      paging {
        current_page
        limit
        total_pages
        total
      }
      rows {
        id
        amount
        transID
        status
        user {
            id
            name
        }
        date
      }
    }
  }
`

export const paymentPagination: BaseApiFunction<Payment[]> = p => {
    return client
        .query<{
            paymentPagination: BaseResponseData<Payment[]>
        }>({
            query: paymentPaginationGql,
            fetchPolicy: 'no-cache',
            variables: { page: p?.page, limit: p?.limit, search: p?.search },
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: (r.data.paymentPagination.rows ?? []).map(Payment.fromJson),
                paging: Pagination.fromJson(r.data.paymentPagination.paging),
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
