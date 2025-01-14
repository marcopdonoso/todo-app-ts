import { type Document } from 'mongoose'
import { type HttpStatusCode } from '../constants/http'

export interface ITag extends Document {
  _id: string
  userId: string
  tagName: string
  tagColor: `#${string}`
}

export interface ISaveTag {
  success: boolean
  statusCode: HttpStatusCode
  msg: string
  tag?: ITag | null
}

export interface IGetTags {
  success: boolean
  statusCode: HttpStatusCode
  msg: string
  tags?: ITag[]
}
