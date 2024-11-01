import { ApolloError, gql } from '@apollo/client';
import { AUTHEN_TOKEN_KEY } from '@constants/key';
import client from '@graphql/client/core_client';
import { handleGraphqlError } from '@graphql/handle';
import { Schedules } from '@models/schedules';
import Cookies from 'js-cookie';

const decodeToken = (token: string) => {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
};

const scheduleGql = gql`
  query schedules($userID: String!) {
    schedules(userID: $userID) {
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

export const getSchedules = () => {
    const token = Cookies.get(AUTHEN_TOKEN_KEY) || '';
    const decoded = decodeToken(token);
    const userID = decoded?.account_id; 
    if (!userID) {
        return Promise.reject(new Error('User ID is not available.'));
    }

    return client
        .query<{
            schedules: BaseResponseData<Schedules[]>
        }>({
            query: scheduleGql,
            fetchPolicy: 'no-cache',
            variables: { userID }, 
            context: {
                headers: {
                    token: token,
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: r.data?.schedules,
            };
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e);
        });
};
