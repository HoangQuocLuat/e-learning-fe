import { keys } from 'lodash'

export enum ACCOUNT_STATUS {
  ACTIVE = 1,
  BLOCK = 2,
}

export const AccountStatusLabel = {
  [ACCOUNT_STATUS.ACTIVE]: 'Đang hoạt động',
  [ACCOUNT_STATUS.BLOCK]: 'Khoá',
} as Record<ACCOUNT_STATUS, string>

export const AccountStatusColor = {
  [ACCOUNT_STATUS.ACTIVE]: 'green',
  [ACCOUNT_STATUS.BLOCK]: 'red',
} as Record<ACCOUNT_STATUS, string>

// @ts-ignore
export const AccountStatusList = keys(AccountStatusLabel) as ACCOUNT_STATUS[]

export enum ACCOUNT_ROLE {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export const AccountRoleLabel = {
  [ACCOUNT_ROLE.ADMIN]: 'Admin',
  [ACCOUNT_ROLE.USER]: 'Người dùng',
} as Record<ACCOUNT_ROLE, string>

// @ts-ignore
export const AccountRoleList = keys(AccountRoleLabel) as ACCOUNT_ROLE[]
