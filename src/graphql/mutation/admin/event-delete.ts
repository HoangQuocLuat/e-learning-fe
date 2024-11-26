import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Event } from '@models/event'

const eventDeleteGql = gql`
  mutation EventDelete($data: EventDelete!) {
    eventDelete(data: $data)
  }
`

export const eventDelete = (p: { id: string }) => {
  return client
    .mutate<{
      eventDelete: BaseResponseData<Event>
    }>({
      mutation: eventDeleteGql,
      variables: {
        data: { id: p?.id },
      },
    })
    .then(r => {
      return {
        success: r.data?.eventDelete,
        data: Event.fromJson(r.data?.eventDelete),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
