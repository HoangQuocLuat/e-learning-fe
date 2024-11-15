import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/core_client'
import { handleGraphqlError } from '@graphql/handle'
import { Tuition } from '@models/tuition'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

const decodeToken = (token: string) => {
  if (!token) return null;
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload));
};

const tuitionPaginationByUserIDGql = gql`
  query TuitionPaginationByUserID($page: Int!, $limit: Int!, $orderBy: String, $search: Map, $user_id: String!) {
    tuitionPaginationByUserID(page: $page, limit: $limit, order_by: $orderBy, search: $search, user_id: $user_id) {
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
            user{
            id
        }
      }
    }
  }
`

export const tuitionPaginationByUserID: BaseApiFunction<Tuition[]> = p => {
  const token = Cookies.get(AUTHEN_TOKEN_KEY) || '';
  const decoded = decodeToken(token);
  const userID = decoded?.account_id; 
  if (!userID) {
      return Promise.reject(new Error('User ID is not available.'));
  }
    return client
        .query<{
          tuitionPaginationByUserID: BaseResponseData<Tuition[]>
        }>({
            query: tuitionPaginationByUserIDGql,
            fetchPolicy: 'no-cache',
            variables: { page: p?.page, limit: p?.limit, search: p?.search, user_id: userID  },
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: (r.data.tuitionPaginationByUserID.rows ?? []).map(Tuition.fromJson),
                paging: Pagination.fromJson(r.data.tuitionPaginationByUserID.paging),
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
