import App from '../App'
import { generateRandomId } from '@commons/id'
import { type RouteObject, matchPath } from 'react-router-dom'
import DashboardLayout from '@layouts/dashboard'
import HomeLayout from '@layouts/home'

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
        path: '',
        element: <HomeLayout/>,
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
              title: 'Trang chủ',
            },
          },
          {
            id: generateRandomId(),
            path: 'schedules',
            lazy: async () => {
              const { default: SchedulesPage } = await import('@app/user/schedules')
              return {
                Component: SchedulesPage,
              }
            },
            meta: {
              title: 'Lịch học cá nhân',
            },
          },
          {
            id: generateRandomId(),
            path: 'tuition',
            lazy: async () => {
              const { default: TuitionPage } = await import('@app/user/tuition')
              return {
                Component: TuitionPage,
              }
            },
            meta: {
              title: 'Học phí cá nhân',
            },
          },
          {
            id: generateRandomId(),
            path: 'profile',
            lazy: async () => {
              const { default: ProfilePage } = await import('@app/user/profile')
              return {
                Component: ProfilePage,
              }
            },
            meta: {
              title: 'Thông tin cá nhân',
            },
          },
          {
            id: generateRandomId(),
            path: 'payment',
            lazy: async () => {
              const { default: PaymentPage } = await import('@app/user/payment')
              return {
                Component: PaymentPage,
              }
            },
            meta: {
              title: 'Hóa đơn học phí',
            },
          },
        ]
      },
      {
        id: generateRandomId(),
        path: 'dashboard',
        element: <DashboardLayout/>,
        children: [
          {
            id: generateRandomId(),
            path: '',
            lazy: async () => {
              const { default: DashBoardPage } = await import('@app/dashboard')
              return {
                Component: DashBoardPage,
              }
            },
            meta: {
              title: 'DashBoard',
            },
          },
        ]
      },
      {
        id: generateRandomId(),
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            id: generateRandomId(),
            path: 'accountList',
            lazy: async () => {
              const { default: AccountListPage } = await import('@app/accountList')
              return {
                Component: AccountListPage,
              }
            },
            meta: {
              title: 'Quản lý tài khoản',
            },
          },
        ]
      },
      {
        id: generateRandomId(),
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            id: generateRandomId(),
            path: 'schedules',
            lazy: async () => {
              const { default: SchedulesPage } = await import('@app/schedules')
              return {
                Component: SchedulesPage,
              }
            },
            meta: {
              title: 'Quản lý lịch học',
            },
          },
        ]
      },
      {
        id: generateRandomId(),
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            id: generateRandomId(),
            path: 'class',
            lazy: async () => {
              const { default: ClassPage } = await import('@app/class')
              return {
                Component: ClassPage,
              }
            },
            meta: {
              title: 'Quản lý lớp học',
            },
          },
        ]
      },
      {
        id: generateRandomId(),
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            id: generateRandomId(),
            path: 'tuition',
            lazy: async () => {
              const { default: TuitionPage } = await import('@app/tuition')
              return {
                Component: TuitionPage,
              }
            },
            meta: {
              title: 'Quản lý học phí',
            },
          },
        ]
      },
      {
        id: generateRandomId(),
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            id: generateRandomId(),
            path: 'attendance',
            lazy: async () => {
              const { default:  AttendancePage} = await import('@app/attendance')
              return {
                Component: AttendancePage,
              }
            },
            meta: {
              title: 'Quản lý điểm danh',
            },
          },
        ]
      },
      {
        id: generateRandomId(),
        path: 'dashboard',
        element: <DashboardLayout />,
        children: [
          {
            id: generateRandomId(),
            path: 'payment',
            lazy: async () => {
              const { default:  PaymentPage} = await import('@app/payment')
              return {
                Component: PaymentPage,
              }
            },
            meta: {
              title: 'Quản lý hóa đơn học phí',
            },
          },
        ]
      },
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
