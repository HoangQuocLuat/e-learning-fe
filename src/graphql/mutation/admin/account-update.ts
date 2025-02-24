import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'

const accountUpdateGql = gql`
  mutation UserUpdate($data: ProfileUpdate!) {
    userUpdate(data: $data) {
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
      accountUpdate: BaseResponseData<Account>;
    }>({
      mutation: accountUpdateGql,
      variables: {
        data: {
          id: p.input?.id,
          role: p.input?.role,
          name: p.input?.name,
          date_birth: p.input?.date_birth,
          phone: p.input?.phone,
          email: p.input?.email,
          address: p.input?.address,
          class_id: p.input?.class_id,
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
