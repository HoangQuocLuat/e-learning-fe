import { ApolloError } from '@apollo/client'

export const handleGraphqlError = <T = any>(error: ApolloError) => {
  return {
    success: false,
    message: error.message,
    graphQLErrors: error.graphQLErrors,
    clientErrors: error.clientErrors,
  } as BaseResponse<T>
}
