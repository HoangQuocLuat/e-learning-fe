import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'

const AccountBanGql = gql`
  mutation AccountBan($data: AccountBan!) {
    accountBan(data: $data)
  }
`

export const accountBann = (p: { id: string, status: number })  => {
  return client
  .mutate<{
    accountBan: BaseResponseData<Account>
  }>({
    mutation: AccountBanGql,
    variables: {
      data: { id: p?.id, status: p?.status},
    },
  })
  .then(r => {
    return {
      success: r.data,
      data: Account.fromJson(r.data?.accountBan),
    }
  })
  .catch((e: ApolloError) => {
    return handleGraphqlError(e)
  })
}
