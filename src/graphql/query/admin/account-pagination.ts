import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

const accountPaginationGql = gql`
  query UserPagination($page: Int!, $limit: Int!, $orderBy: String, $search: Map) {
    userPagination(page: $page, limit: $limit, order_by: $orderBy, search: $search) {
      paging {
        current_page
        limit
        total_pages
        total
      }
      rows {
        id
        user_name
        role
        status
        name
        date_birth
        phone
        email
        address
        user_type
        avatar
      }
    }
  }
`

export const accountPagination: BaseApiFunction<Account[]> = p => {
    return client
        .query<{
            userPagination: BaseResponseData<Account[]>
        }>({
            query: accountPaginationGql,
            fetchPolicy: 'no-cache',
            variables: { page: p?.page, limit: p?.limit, search: p?.search },
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
          console.log(r)
            return {
                success: true,
                data: (r.data.userPagination.rows ?? []).map(Account.fromJson),
                paging: Pagination.fromJson(r.data.userPagination.paging),
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
