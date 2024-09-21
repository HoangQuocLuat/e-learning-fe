export const router_keys = {
    login: '/login',
    home: '/home',
    dashboard: '/dashboard',
    accountList: 'dashboard/accountList',
    schedules: 'dashboard/schedules',
  
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
  