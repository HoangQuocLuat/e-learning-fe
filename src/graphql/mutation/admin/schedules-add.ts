import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Schedules } from '@models/schedules'

const schedulesAddGql = gql`
  mutation SchedulesAdd($data: SchedulesAdd!) {
    schedulesAdd(data: $data) {
      id
      start_time
      end_time
      start_date
      end_date
      schedules_type
      description
      day_of_week
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
          start_date: p.input?.start_date,
          end_date: p.input?.end_date,
          start_time: p.input?.start_time,
          end_time: p.input?.end_time,
          schedules_type: p.input?.schedules_type,
          description: p.input?.description,
          day_of_week: p.input?.day_of_week,
        },
      },
    })
    .then(r => {
      // console.log(r.data?.schedulesAdd)
      return {
        success: true,
        data: Schedules.fromJson(r.data?.schedulesAdd),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
