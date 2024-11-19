import { ApolloError, gql } from '@apollo/client';
import { AUTHEN_TOKEN_KEY } from '@constants/key';
import client from '@graphql/client/core_client';
import { handleGraphqlError } from '@graphql/handle';
import { Tuition } from '@models/tuition';
import Cookies from 'js-cookie';

const decodeToken = (token: string) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
};

const tuitionGql = gql`
  query tuition($user_id: String!) {
    tuition(user_id: $user_id) {
        id
        total_fee
        discount
        paid_amount
        remaining_fee
        user{
            id
        }
    }
  }
`;

export const getTuition = () => {
    const token = Cookies.get(AUTHEN_TOKEN_KEY) || '';
    const decoded = decodeToken(token);
    const userID = decoded?.account_id; 
    if (!userID) {
        return Promise.reject(new Error('User ID is not available.'));
    }

    return client
        .query<{
            tuition: BaseResponseData<Tuition[]>
        }>({
            query: tuitionGql,
            fetchPolicy: 'no-cache',
            variables: { user_id: userID }, 
            context: {
                headers: {
                    token: token,
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: r.data?.tuition,
            };
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e);
        });
    };
