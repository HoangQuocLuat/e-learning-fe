import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Class } from '@models/class'
import Cookies from 'js-cookie'

const classUpdateGql = gql`
  mutation ClassUpdate($data: ClassUpdate!) {
    classUpdate(data: $data) {
        id
        class_name
        price
      }
    }
`

export const classUpdate: BaseApiFunction<Class> = p => {
  return client
    .mutate<{
      classUpdate: BaseResponseData<Class>
    }>({
      mutation: classUpdateGql,
      variables: {
        data: {
          id: p.input?.id,
          name: p.input?.class_name,
          price: p.input?.price,
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
        data: r.data?.classUpdate,
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}