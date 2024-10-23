export const router_keys = {
    login: '/login',
    home: '/home',
    tuitionUser: '/tuitionUser',
    schedulesUser: '/schedulesUser',
    inforUser:'/inforUser',
    dashboard: '/dashboard',
    accountList: '/dashboard/accountList',
    schedules: '/dashboard/schedules',
    class: '/dashboard/class',
    tuition: '/dashboard/tuition',
    attendance: '/dashboard/attendance',
    template: {
      table: {
        list: '/template/table',
        detail: (id: string) => `/template/table/${id}`,
      },
      management: {
        list: '/template/management',
        detail: (id: string) => `/template/management/${id}`,
      }
    },
    profile: '/profile',
  }
  