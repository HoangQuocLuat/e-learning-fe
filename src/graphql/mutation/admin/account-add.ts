import { ApolloError, gql } from '@apollo/client'
import { ACCOUNT_ROLE } from '@constants/defines'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Account } from '@models/account'

const accountAddGql = gql`
  mutation AccountAdd($data: AccountAdd!) {
    accountAdd(data: $data) {
      id
      email
      role
      status
      name
      date_birth
      phone
      address
    }
  }
`

export const accountAdd: BaseApiFunction<
  Account,
  {
    username?: string
    password?: string
    role?: ACCOUNT_ROLE
  }
> = p => {
  return client
    .mutate<{
      accountAdd: BaseResponseData<Account>
    }>({
      mutation: accountAddGql,
      variables: {
        data: p.input,
      },
    })
    .then(r => {
      return {
        success: true,
        data: Account.fromJson(r.data?.accountAdd),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
