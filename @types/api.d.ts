import { ApolloError } from '@apollo/client'
import { Paging } from '@models/pagination'

declare global {
  namespace API {
    namespace V1 {
      interface BaseResponse<T> {
        message: string | string[]
        status?: number
        data?: T
      }

    //   interface Response<T = any> {
    //     data?: T
    //   }

    //   interface ResponseList<T = any> {
    //     rows?: T[]
    //     paging?: {
    //       current_page: number
    //       limit: number
    //       total_page: number
    //       total: number
    //     }
    //   }

      export type ExpressResponse<T> = Res<BaseResponse<T>>

      export type ExpressResponseList<T> = Res<BaseResponse<ResponseList<T>>>
    }
  }

  import type { CancelTokenSource } from 'axios'

  export interface BaseResponse<T = any> {
    success?: boolean

    data?: T

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    paging?: T extends (infer R)[] ? Paging : never

    cancel?: boolean

    status?: string | number

    message?: string

    graphQLErrors?: ApolloError['graphQLErrors']

    clientErrors?: ApolloError['clientErrors']

    networkError?: ApolloError['networkError']

    errorCode?: string

    countUnread?: number
  }

//   export type PBaseResponse<T = any> = Promise<BaseResponse<T>>

  export type BaseResponseData<T> = T extends (infer R)[]
    ? {
        rows: R[]

        paging: {
          next_page?: number
          current_link?: string
          next_link?: string
          current_page?: number
          total_page?: number
          limit?: number
          count?: number
        }
      }
    : T

//   export interface BaseResponseServer<T> {
//     data: T extends (infer R)[]
//       ? {
//           rows: R[]

//           paging: {
//             next_page?: number
//             current_link?: string
//             next_link?: string
//             current_page?: number
//             total_page?: number
//             limit?: number
//             count?: number
//             total?: number
//           }
//         }
//       : T

//     error_code: number

//     message: string
//   }
//   export interface BaseParam<T = any> {
//     originalCode?: string

//     status?: number

//     id?: string | number

//     authen?: string

//     language?: string

//     cancelToken?: CancelTokenSource

//     input?: T

//     search?: Record<string, any>

//     page?: number

//     limit?: number

//     orderBy?: string

//     workspaceId?: string

//     cache?: boolean

//     serviceCategoryId?: string
//   }

//   interface Page {
//     count?: number
//     current?: number
//     limit?: number
//     max?: number
//   }

  export type BaseApiFunction<R, T = any> = (param: BaseParam<T>) => Promise<BaseResponse<R>>
}

export {}
