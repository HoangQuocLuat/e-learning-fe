import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Tuition } from '@models/tuition'
import Cookies from 'js-cookie'

const tuitionUpdateGql = gql`
  mutation TuitionUpdate($data: TuitionUpdate!) {
    tuitionUpdate(data: $data) {
        id
        total_fee
        discount
        paid_amount
        remaining_fee
      }
    }
`

export const tuitionUpdate: BaseApiFunction<Tuition> = p => {
  return client
    .mutate<{
      tuitionnUpdate: BaseResponseData<Tuition>
    }>({
      mutation: tuitionUpdateGql,
      variables: {
        data: {
          id: p.input?.id,
          total_fee: p.input?.total_fee,
          discount: p.input?.discount,
          paid_amount: p.input?.paid_amount,
          remaining_fee: p.input?.remaining_fee,
        },
      },
      context: {
        headers: {
          token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
        },
      },
    })
    .then(r => {
      return {
        success: true,
        data: r.data?.tuitionnUpdate,
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}