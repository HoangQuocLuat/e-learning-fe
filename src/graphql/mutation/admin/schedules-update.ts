import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Schedules } from '@models/schedules'
import Cookies from 'js-cookie'

const schedulesUpdateGql = gql`
  mutation SchedulesUpdate($data: SchedulesUpdate!) {
    schedulesUpdate(data: $data) {
        id
        day_of_week
        day
        start_time
        end_time
        schedules_type
        description
      }
    }
`

export const schedulesUpdate: BaseApiFunction<Schedules> = p => {
  return client
    .mutate<{
      schedulesUpdate: BaseResponseData<Schedules>
    }>({
      mutation: schedulesUpdateGql,
      variables: {
        data: {
          id: p.input?.id,
          start_time: p.input?.start_time,
          end_time: p.input?.end_time,
          schedules_type: p.input?.schedules_type,
          description: p.input?.description,
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
        data: r.data?.schedulesUpdate,
      }
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e)
    })
}