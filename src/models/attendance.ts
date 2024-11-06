import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'
import { Account } from './account'

@model()
export class Attendance extends Base {
  @field()
  user?: Account

  @field()
  time_check_in?: string


  get name(): string {
    return this.user?.name || ''
  }

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
  static override fromJson(json?: any) {
    return new Attendance(json ?? {})
  }

  static get default() {
    return this.fromJson({})
  }

  static clone(d?: Attendance) {
    return d ? clone(d) : new Attendance({})
  }
}
