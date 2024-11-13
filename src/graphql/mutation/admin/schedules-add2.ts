import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Schedules } from '@models/schedules'

const schedulesAddGql = gql`
  mutation SchedulesAdd2($data: SchedulesAdd2!) {
    schedulesAdd2(data: $data) {
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

export const schedulesAdd2: BaseApiFunction<Schedules> = (p) => {
    console.log("â", p)
  return client
    .mutate<{
      schedulesAdd: BaseResponseData<Schedules>;
    }>({
      mutation: schedulesAddGql,
      variables: {
        data: {
          class_id: p.input?.class_id,
          day: p.input?.day,
          start_time: p.input?.start_time,
          end_time: p.input?.end_time,
          schedules_type: p.input?.schedules_type,
          description: p.input?.description,
        },
      },
    })
    .then(r => {
      console.log(r.data?.schedulesAdd)
      return {
        success: true,
        data: Schedules.fromJson(r.data?.schedulesAdd),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
