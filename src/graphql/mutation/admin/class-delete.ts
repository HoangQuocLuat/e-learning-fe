import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Class } from '@models/class'

const classDeleteGql = gql`
  mutation ClassDelete($data: ClassDelete!) {
    classDelete(data: $data)
  }
`

export const classDelete = (p: { id: string }) => {
  return client
    .mutate<{
      classDelete: BaseResponseData<Class>
    }>({
      mutation: classDeleteGql,
      variables: {
        data: { id: p?.id },
      },
    })
    .then(r => {
      return {
        success: r.data?.classDelete,
        data: Class.fromJson(r.data?.classDelete),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
