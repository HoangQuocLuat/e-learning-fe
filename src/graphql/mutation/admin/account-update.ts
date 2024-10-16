import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'

const accountUpdateGql = gql`
  mutation UserAdd($data: UserAdd!) {
    userAdd(data: $data) {
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

export const accountUpdate: BaseApiFunction<Account> = (p) => {
  return client
    .mutate<{
      accountAdd: BaseResponseData<Account>;
    }>({
      mutation: accountUpdateGql,
      variables: {
        data: {
          user_name: p.input?.user_name,
          password: p.input?.password,
          role: p.input?.role,
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
        data: Account.fromJson(r.data?.accountAdd),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
