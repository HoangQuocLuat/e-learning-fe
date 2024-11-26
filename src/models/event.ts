import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'
@model()
export class Event extends Base {
  @field()
  title?:string
  
  @field()
  description?: string

  @field()
  images?: string

  @field()
  docurl?: string

  @field()
  date?: string

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
  static override fromJson(json?: any) {
    return new Event(json ?? {})
  }

  static get default() {
    return this.fromJson({})
  }

  static clone(d?: Event) {
    return d ? clone(d) : new Event({})
  }
}
