import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/core_client'
import { handleGraphqlError } from '@graphql/handle'
import { Payment } from '@models/payment'
import { Pagination } from '@models/pagination'
import Cookies from 'js-cookie'

const decodeToken = (token: string) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
};

const paymentPaginationByIDGql = gql`
  query PaymentPaginationByID($page: Int!, $limit: Int!, $id: String! ,$orderBy: String, $search: Map) {
    paymentPaginationByID(page: $page, limit: $limit, id: $id ,order_by: $orderBy, search: $search) {
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
        date
      }
    }
  }
`

export const paymentPaginationByID: BaseApiFunction<Payment[]> = p => {
    const token = Cookies.get(AUTHEN_TOKEN_KEY) || '';
    const decoded = decodeToken(token);
    const userID = decoded?.account_id; 
    if (!userID) {
        return Promise.reject(new Error('User ID is not available.'));
    }

    return client
        .query<{
            paymentPaginationByID: BaseResponseData<Payment[]>
        }>({
            query: paymentPaginationByIDGql,
            fetchPolicy: 'no-cache',
            variables: { page: p?.page, limit: p?.limit, search: p?.search, id: userID },
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: (r.data.paymentPaginationByID.rows ?? []).map(Payment.fromJson),
                paging: Pagination.fromJson(r.data.paymentPaginationByID.paging),
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
