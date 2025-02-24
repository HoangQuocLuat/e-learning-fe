import { removeIfNotExist } from '@commons/object'
import { useNavigate, useLocation, To, NavigateOptions } from 'react-router-dom'
import { useMemo } from 'react'
import nProgress from 'nprogress'

export const usePushShallowRoute = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    param?: Record<string, any>,
    options?: {
      pathname?: string | ((base: string) => string)
    },
  ) => {
    const { pathname } = options ?? {}

    const getPathname = () => {
      if (typeof pathname === 'function') {
        return pathname(location.pathname)
      }
      if (typeof pathname === 'string') {
        return pathname
      }

      return location.pathname
    }

    // const url = `${getPathname()}?${new URLSearchParams(removeIfNotExist(param ?? {})).toString()}`
    navigate({
      search: new URLSearchParams(removeIfNotExist(param ?? {})).toString(),
      pathname: getPathname(),
    })
  }
}

export const usePushRouter = () => {
  const navigate = useNavigate()
  const push = (path: To, options?: NavigateOptions) => {
    nProgress.start()
    navigate(path, options)
  }

  const back = () => navigate(-1)

  return { push, back }
}
// @ts-ignore
export const useParams: <T extends Record<string, any>, U extends keyof T>(
  key: U[],
) => Pick<T, U> = key => {
  const location = useLocation()

  return useMemo(() => {
    const searchParams = new URLSearchParams(location.search)
    return key.reduce((acc, key) => {
      // @ts-ignore
      acc[key] = searchParams.get(key)
      return acc
    }, {})
  }, [key, location.search])
}
