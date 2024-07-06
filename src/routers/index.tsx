import HomePage from '@app/home'
import App from '../App'
import { generateRandomId } from '@commons/id'
import { type RouteObject, matchPath } from 'react-router-dom'

export type DataRouteObject = Omit<RouteObject, 'children'> & {
  id: string
  children?: DataRouteObject[]
  meta?: {
    title?: string
    titleKey?: string
  }
}

export const routers: DataRouteObject[] = [
  {
    id: generateRandomId(),
    element: <App />,
    children: [
      {
        id: generateRandomId(),
        path: 'login',
        lazy: async () => {
          const { default: LoginPage } = await import('@app/login')
          return {
            Component: LoginPage,
          }
        },
        meta: {
          title: 'Login',
        },
      },
      {
        id: generateRandomId(),
        path: 'home',
        element: <HomePage/>,
        children: [
          {
            id: generateRandomId(),
            path: '',
            lazy: async () => {
              const { default: HomePage } = await import('@app/home')
              return {
                Component: HomePage,
              }
            },
            meta: {
              title: 'Home',
            },
          },
        ]
      }
    ],
  },
]

type R = {
  id: string
  paths: string[]
  path: string
  meta: DataRouteObject['meta']
  pathString?: string
  parent?: string
}

const getRoutes: (router: DataRouteObject, prePath?: string[]) => R[] = (router, prePath) => {
  const routers = []
  const id = generateRandomId()
  if (router.path) {
    routers.push({
      id,
      paths: (prePath ?? []).concat(router.path ?? '').filter(i => !!i),
      meta: router.meta,
      path: router.path,
    })
  }

  if (router.children?.length) {
    return routers.concat(
      router.children.reduce<R[]>(
        (a, i: DataRouteObject) =>
          a.concat(
            getRoutes(
              i,
              (prePath ?? []).concat(router.path ?? '').filter(i => !!i),
            ).map(i => ({ parent: router.path ? id : undefined, ...i })),
          ),
        [],
      ),
    )
  }

  return routers
}

export const routerArr = routers
  .reduce<R[]>((a, i) => a.concat(getRoutes(i, [])), [])
  .map(i => ({ ...i, pathString: i.paths.join('/') }))

export const findRouter = (pathname: string) => {
  return routerArr.find(i => matchPath(i.pathString, pathname))
}

export const findRouterById = (id: string) => {
  return routerArr.find(i => i.id === id)
}
