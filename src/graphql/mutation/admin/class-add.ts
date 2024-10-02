import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Class } from '@models/class'

const classAddGql = gql`
  mutation ClassAdd($data: ClassAdd!) {
    classAdd(data: $data) {
      class_name
    }
  }
`;

export const classAdd: BaseApiFunction<Class> = (p) => {
  return client
    .mutate<{
      classAdd: BaseResponseData<Class>;
    }>({
      mutation: classAddGql,
      variables: {
        data: {
          class_name: p.input?.class_name,
        },
      },
    })
    .then(r => {
      return {
        success: true,
        data: Class.fromJson(r.data?.classAdd),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
