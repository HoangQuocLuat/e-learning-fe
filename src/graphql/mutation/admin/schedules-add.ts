import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Schedules } from '@models/schedules'

const schedulesAddGql = gql`
  mutation SchedulesAdd($data: SchedulesAdd!) {
    schedulesAdd(data: $data) {
        id
        day_of_week
        day
        start_time
        end_time
        schedules_type
        description
    }
  }
`;

export const schedulesAdd: BaseApiFunction<Schedules> = (p) => {
  return client
    .mutate<{
      schedulesAdd: BaseResponseData<Schedules>;
    }>({
      mutation: schedulesAddGql,
      variables: {
        data: {
          class_id: p.input?.class_id,
          day_of_week: p.input?.day_of_week,
          start_date: p.input?.start_date,
          end_date: p.input?.end_date,
          start_time: p.input?.start_time,
          end_time: p.input?.end_time,
          schedules_type: p.input?.schedules_type,
          description: p.input?.description,
        },
      },
    })
    .then(r => {
      return {
        success: true,
        data: Schedules.fromJson(r.data?.schedulesAdd),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
