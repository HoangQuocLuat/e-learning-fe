import { ApolloError, gql } from '@apollo/client';
import { AUTHEN_TOKEN_KEY } from '@constants/key';
import client from '@graphql/client/admin_client';
import { handleGraphqlError } from '@graphql/handle';
import { Schedules } from '@models/schedules';
import Cookies from 'js-cookie';

// Hàm giải mã token
const decodeToken = (token: string) => {
    console.log("aa",token)
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
};

const scheduleGql = gql`
  query schedule($userID: String!) {
    schedule(userID: $userID) {
        id
        day_of_week
        start_date
        end_date
        start_time
        end_time
        schedules_type
        description
    }
  }
`;

export const schedule = () => {
    const token = Cookies.get(AUTHEN_TOKEN_KEY) || '';
    const decoded = decodeToken(token); // Giải mã token
    console.log("decoded:",decoded )
    const userID = decoded?.id; // Lấy userID từ payload của token
    console.log("userID:",userID )

    // Kiểm tra xem userID có tồn tại không
    if (!userID) {
        return Promise.reject(new Error('User ID is not available.'));
    }

    return client
        .query<{
            schedule: BaseResponseData<Schedules[]>
        }>({
            query: scheduleGql,
            fetchPolicy: 'no-cache',
            variables: { userID }, // Sử dụng userID đã lấy
            context: {
                headers: {
                    token: token, // Sử dụng token đã lấy
                },
            },
        })
        .then(r => {
            return {
                success: true,
                data: r.data?.schedule,
            };
        })
        .catch((e: ApolloError) => {
            return handleGraphqlError(e);
        });
};
