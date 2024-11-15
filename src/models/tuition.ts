import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'
import {Account} from './account'

@model()
export class Tuition extends Base {
  @field()
  user?: Account

  @field()
  total_fee?: number

  @field()
  discount?: number

  @field()
  remaining_fee?: number

  @field()
  paid_amount?: number

  @field()
  month?: string

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
  static override fromJson(json?: any) {
    return new Tuition(json ?? {})
  }

  static get default() {
    return this.fromJson({})
  }

  static clone(d?: Tuition) {
    return d ? clone(d) : new Tuition({})
  }
}
