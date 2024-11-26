import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Event } from '@models/event'

const eventAddGql = gql`
  mutation EventAdd($data: EventAdd!) {
    eventAdd(data: $data) {
      id
      title
      description
      images
      doc_url
      date
    }
  }
`

export const eventAdd: BaseApiFunction<Event> = p => {
  return client
    .mutate<{
      eventAdd: BaseResponseData<Event>
    }>({
      mutation: eventAddGql,
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
        data: Event.fromJson(r.data?.eventAdd),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
