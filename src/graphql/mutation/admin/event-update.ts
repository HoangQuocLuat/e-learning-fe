import { ApolloError, gql } from '@apollo/client'
import client from '@graphql/client/admin_client'
import { handleGraphqlError } from '@graphql/handle'
import { Event } from '@models/event'

const eventUpdateGql = gql`
  mutation EventUpdate($data: EventUpdate!) {
    eventUpdate(data: $data) {
      id
      title
      description
      images
      doc_url
      date
    }
  }
`;

export const eventUpdate: BaseApiFunction<Event> = (p) => {
  return client
    .mutate<{
      eventUpdate: BaseResponseData<Event>;
    }>({
      mutation: eventUpdateGql,
      variables: {
        data: {
          id: p.input?.id,
          title: p.input?.title,
          description: p.input?.description,
        },
      },
    })
    .then(r => {
      return {
        success: true,
        data: Event.fromJson(r.data?.eventUpdate),
      };
    })
    .catch((e: ApolloError) => {
      return handleGraphqlError(e);
    });
};
