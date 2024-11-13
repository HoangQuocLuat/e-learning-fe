import { field } from '@decorators/field'
import { model } from '@decorators/model'
import clone from 'lodash/clone'
import { Base } from './base'

@model()
export class Class extends Base {

  @field()
  class_name?: string

  public toAddJson() {
    return {
      ...this.toJson(),
    }
  }
  static override fromJson(json?: any) {
    return new Class(json ?? {})
  }

  static get default() {
    return this.fromJson({})
  }

  static clone(d?: Class) {
    return d ? clone(d) : new Class({})
  }
}
