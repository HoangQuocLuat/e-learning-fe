import { ApolloError, gql } from '@apollo/client';
import client from '@graphql/client/admin_client';
import { handleGraphqlError } from '@graphql/handle';
import { Instruct } from '@models/instruct';

const instructDeleteGql = gql`
  mutation InstructDelete($data: InstructDelete!) {
    instructDelete(data: $data)
  }
`;

export const instructDelete = (p: { id: string }) => {
  return client
    .mutate<{
      instructDelete: BaseResponseData<Instruct>;
    }>({
      mutation: instructDeleteGql,
      variables: {
        data: { id: p?.id },
      },
    })
    .then(r => {
      return {
        success: r.data?.instructDelete,
        data: Instruct.fromJson(r.data?.instructDelete),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
