import { ApolloError, gql } from '@apollo/client';
import { AUTHEN_TOKEN_KEY } from '@constants/key';
import client from '@graphql/client/core_client';
import { handleGraphqlError } from '@graphql/handle';
import { Account } from '@models/account';
import Cookies from 'js-cookie';

const decodeToken = (token: string) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
};

const userMeGql = gql`
  query UserMe($user_id: String!) {
    userMe(user_id: $user_id) {
        id
        user_name
        role
        status
        name
        date_birth
        phone
        email
        address
        avatar
        user_type
        lessons_count
        class {
            id
            class_name
        }
    }
  }
`;

export const getUserMe = () => {
    const token = Cookies.get(AUTHEN_TOKEN_KEY) || '';
    const decoded = decodeToken(token);
    const userID = decoded?.account_id; 
    if (!userID) {
        return Promise.reject(new Error('User ID is not available.'));
    }

    return client
        .query<{
            userMe: BaseResponseData<Account>
        }>({
            query: userMeGql,
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
                data: r?.data?.userMe,
            };
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e);
        });
};
