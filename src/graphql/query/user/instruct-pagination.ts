import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/core_client'
import { handleGraphqlError } from '@graphql/handle'
import { Instruct } from '@models/instruct'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

const instructPaginationGql = gql`
  query InstructPagination($page: Int!, $limit: Int!, $orderBy: String, $search: Map) {
    instructPagination(page: $page, limit: $limit, order_by: $orderBy, search: $search) {
      paging {
        current_page
        limit
        total_pages
        total
      }
      rows {
        id
        title
        description
        images
        doc_url
        date
      }
    }
  }
`

export const instructPagination: BaseApiFunction<Instruct[]> = p => {
    return client
        .query<{
            instructPagination: BaseResponseData<Instruct[]>
        }>({
            query: instructPaginationGql,
            fetchPolicy: 'no-cache',
            variables: { page: p?.page, limit: p?.limit, search: p?.search},
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: (r.data.instructPagination.rows ?? []).map(Instruct.fromJson),
                paging: Pagination.fromJson(r.data.instructPagination.paging),
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
