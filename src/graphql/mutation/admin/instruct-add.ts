import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Instruct } from '@models/instruct'

const instructAddGql = gql`
  mutation InstructAdd($data: InstructAdd!) {
    instructAdd(data: $data) {
      id
      title
      description
      images
      doc_url
      date
    }
  }
`

export const instructAdd: BaseApiFunction<Instruct> = p => {
  return client
    .mutate<{
      instructAdd: BaseResponseData<Instruct>
    }>({
      mutation: instructAddGql,
      variables: {
        data: {
          title: p.input?.title,
          description: p.input?.description,
          images: p.input?.images,
          doc_url: p.input?.doc_url,
          date: p.input?.date,
        },
      },
    })
    .then(r => {
      return {
        success: true,
        data: Instruct.fromJson(r.data?.instructAdd),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
