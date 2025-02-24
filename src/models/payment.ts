import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'
import { Account } from './account'

@model()
export class Payment extends Base {
  @field()
  user?: Account

  @field()
  amount?: string

  @field()
  transID?: string

  @field()
  status?: string

  @field()
  date?: string

  get name(): string {
    return this.user?.name || ''
  }

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
  static override fromJson(json?: any) {
    return new Payment(json ?? {})
  }

  static get default() {
    return this.fromJson({})
  }

  static clone(d?: Payment) {
    return d ? clone(d) : new Payment({})
  }
}
