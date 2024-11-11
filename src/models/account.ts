import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'
import {Class} from './class'
@model()
export class Account extends Base {
  @field()
  class?: Class
  @field()
  class_id?: string

  @field()
  status?: string

  @field()
  user_name?: string

  @field()
  role?: string

  @field()
  password?: string

  @field()
  name?:string
  
  @field()
  date_birth?: string

  @field()
  phone?: string

  @field()
  email?: string
  
  @field()
  address?: string

  @field()
  avatar?: string

  @field()
  user_type?: number

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
