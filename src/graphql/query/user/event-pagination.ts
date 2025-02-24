import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/core_client'
import { handleGraphqlError } from '@graphql/handle'
import { Event } from '@models/event'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

const eventPaginationGql = gql`
  query EventPagination($page: Int!, $limit: Int!, $orderBy: String, $search: Map) {
    eventPagination(page: $page, limit: $limit, order_by: $orderBy, search: $search) {
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

export const eventPagination: BaseApiFunction<Event[]> = p => {
    return client
        .query<{
            eventPagination: BaseResponseData<Event[]>
        }>({
            query: eventPaginationGql,
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
                data: (r.data.eventPagination.rows ?? []).map(Event.fromJson),
                paging: Pagination.fromJson(r.data.eventPagination.paging),
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
