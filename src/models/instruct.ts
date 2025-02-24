import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'
@model()
export class Instruct extends Base {
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
    return new Instruct(json ?? {})
  }

  static get default() {
    return this.fromJson({})
  }

  static clone(d?: Instruct) {
    return d ? clone(d) : new Instruct({})
  }
}
