import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Instruct } from '@models/instruct'

const instructUpdateGql = gql`
  mutation InstructUpdate($data: InstructUpdate!) {
    instructUpdate(data: $data) {
      id
      title
      description
      images
      doc_url
      date
    }
  }
`;

export const instructUpdate: BaseApiFunction<Instruct> = (p) => {
  return client
    .mutate<{
      instructUpdate: BaseResponseData<Instruct>;
    }>({
      mutation: instructUpdateGql,
      variables: {
        data: {
          id: p.input?.id,
          title: p.input?.title,
          description: p.input?.description,
        },
      },
    })
    .then(r => {
      return {
        success: true,
        data: Instruct.fromJson(r.data?.instructUpdate),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
