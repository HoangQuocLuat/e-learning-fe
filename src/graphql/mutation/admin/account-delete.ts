import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'

const accountDeleteGql = gql`
  mutation AccountDelete($data: AccountDelete!) {
    accountDelete(data: $data) {
      id
      email
      role
      status
    }
  }
`

export const accountDelete = (p: { id: string }) => {
  return client
    .mutate<{
      accountDelete: BaseResponseData<Account>
    }>({
      mutation: accountDeleteGql,
      variables: {
        data: { id: p?.id },
      },
    })
    .then(r => {
      return {
        success: r.data?.accountDelete?.status,
        data: Account.fromJson(r.data?.accountDelete),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
