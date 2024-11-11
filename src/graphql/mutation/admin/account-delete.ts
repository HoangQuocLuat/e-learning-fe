import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'

const accountDeleteGql = gql`
  mutation UserDelete($data: UserDelete!) {
    userDelete(data: $data)
  }
`

export const accountDelete = (p: { id: string }) => {
  return client
    .mutate<{
      aDelete: BaseResponseData<Account>
    }>({
      mutation: accountDeleteGql,
      variables: {
        data: { id: p?.id },
      },
    })
    .then(r => {
      return {
        success: r.data,
        data: Account.fromJson(r.data?.aDelete),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
