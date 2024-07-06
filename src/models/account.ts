import { ACCOUNT_ROLE, ACCOUNT_STATUS } from '@constants/defines'
import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'

@model()
export class Account extends Base {
  @field()
  status?: ACCOUNT_STATUS

  @field()
  email?: string

  @field()
  role?: ACCOUNT_ROLE

  password?: string

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
  static override fromJson(json?: any) {
    return new Account(json ?? {})
  }

  static get default() {
    return this.fromJson({})
  }

  static clone(d?: Account) {
    return d ? clone(d) : new Account({})
  }
}
