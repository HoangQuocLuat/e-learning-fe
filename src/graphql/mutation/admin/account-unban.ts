import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'

const AccountUnBanGql = gql`
  mutation AccountUnBan($data: AccountUnBan!) {
    accountBan(data: $data)
  }
`

export const accountUnBann = (p: { id: string, status: number })  => {
  return client
  .mutate<{
    accountUnBan: BaseResponseData<Account>
  }>({
    mutation: AccountUnBanGql,
    variables: {
      data: { id: p?.id, status: p?.status},
    },
  })
  .then(r => {
    return {
      success: r.data,
      data: Account.fromJson(r.data?.accountUnBan),
    }
  })
  .catch((e: ApolloError) => {
    return handleGraphqlError(e)
  })
}
