import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'
import {Class} from './class'

@model()
export class Schedules extends Base {
  @field()
  class?: Class

  @field()
  class_id?: string

  @field()
  start_time?: string

  @field()
  start_date?: string

  @field()
  end_date?: string

  @field()
  day?: string

  @field()
  end_time?: string

  @field()
  description?: string

  @field()
  schedules_type?:string

  @field()
  day_of_week?:number


  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
  static override fromJson(json?: any) {
    return new Schedules(json ?? {})
  }

  static get default() {
    return this.fromJson({})
  }

  static clone(d?: Schedules) {
    return d ? clone(d) : new Schedules({})
  }
}
