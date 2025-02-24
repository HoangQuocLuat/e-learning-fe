import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key';
import client from '@graphql/client/core_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'
import Cookies from 'js-cookie';
const decodeToken = (token: string) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
};

const infoUpdateGql = gql`
  mutation UserUpdateInfo($data: ProfileUpdateByUser!) {
    userUpdateInfo(data: $data) {
      id
      user_name
      role
      status
      name
      date_birth
      phone
      email
      address
    }
  }
`;

export const infoUpdate: BaseApiFunction<Account> = (p) => {
    const token = Cookies.get(AUTHEN_TOKEN_KEY) || '';
    const decoded = decodeToken(token);
    const userID = decoded?.account_id; 
    if (!userID) {
        return Promise.reject(new Error('User ID is not available.'));
    }
  return client
    .mutate<{
      accountUpdate: BaseResponseData<Account>;
    }>({
      mutation: infoUpdateGql,
      variables: {
        data: {
          id: userID,
          password: p.input?.password,
          name: p.input?.name,
          date_birth: p.input?.date_birth,
          phone: p.input?.phone,
          email: p.input?.email,
          address: p.input?.address,
        },
      },
    })
    .then(r => {
      return {
        success: true,
        data: Account.fromJson(r.data?.accountUpdate),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
