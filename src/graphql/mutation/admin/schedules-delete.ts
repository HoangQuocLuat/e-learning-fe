import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Schedules } from '@models/schedules'

const schedulesDeleteGql = gql`
  mutation SchedulesDelete($data: SchedulesDelete!) {
    schedulesDelete(data: $data)
  }
`

export const schedulesDelete = (p: { id: string }) => {
  return client
    .mutate<{
      schedulesDelete: BaseResponseData<Schedules>
    }>({
      mutation: schedulesDeleteGql,
      variables: {
        data: { id: p?.id },
      },
    })
    .then(r => {
      return {
        success: r.data?.schedulesDelete,
        data: Schedules.fromJson(r.data?.schedulesDelete),
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}
