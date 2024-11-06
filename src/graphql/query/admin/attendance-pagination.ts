import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Attendance } from '@models/attendance'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

const attendancePaginationGql = gql`
  query AttendancePagination($page: Int!, $limit: Int!, $orderBy: String, $search: Map) {
    attendancePagination(page: $page, limit: $limit, order_by: $orderBy, search: $search) {
      paging {
        current_page
        limit
        total_pages
        total
      }
      rows {
        id
        time_check_in
        status_check_in
        time_check_out
        user {
          id
          name
        }
      }
    }
  }
`

export const attendancePagination: BaseApiFunction<Attendance[]> = p => {
    return client
        .query<{
            attendancePagination: BaseResponseData<Attendance[]>
        }>({
            query: attendancePaginationGql,
            fetchPolicy: 'no-cache',
            variables: { page: p?.page, limit: p?.limit, search: p?.search },
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
            console.log(r.data.attendancePagination.rows)
            return {
                success: true,
                data: (r.data.attendancePagination.rows ?? []).map(Attendance.fromJson),
                paging: Pagination.fromJson(r.data.attendancePagination.paging),
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
