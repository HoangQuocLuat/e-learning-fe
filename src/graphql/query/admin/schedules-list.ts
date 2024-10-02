import { ApolloError, gql } from '@apollo/client'
import { AUTHEN_TOKEN_KEY } from '@constants/key'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Schedules } from '@models/schedules'
import Cookies from 'js-cookie'

const schedulesListGql = gql`
  query SchedulesList {
    schedulesList {
        id
        day_of_week
        start_date
        end_date
        start_time
        end_time
        schedules_type
        description
        class {
            id
            class_name
        }
    }
  }
`
export const schedulesList = () => {
    return client
        .query<{
            schedulesList: BaseResponseData<Schedules[]>
        }>({
            query: schedulesListGql,
            fetchPolicy: 'no-cache',
            context: {
                headers: {
                    token: Cookies.get(AUTHEN_TOKEN_KEY) || '',
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: r.data?.schedulesList,
            }
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e)
        })
}
