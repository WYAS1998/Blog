import { Binary, Long } from "mongodb";

export enum Status {
  delete = -1,
  normal,
}

export interface IArticle {
  content: string
  title: string
  subTitle: string
  tags: string
  ctime: number
  mtime: number
  status?: number
  banner: string[]
  preview: number
  author: string
}

export interface ITag {
  title: string
  ctime: number
  status?: Status
}

export interface IUser {
  nickname: string
  account: string
  avatar: string
  pwd: string
  ctime: number
  status: Status
}

export interface IToken {
  userId: string
  // token: string
}

export interface IFile {
  key: string
  name: string
  data: Binary
  size: number
  createdAt: Long
}