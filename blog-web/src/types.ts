import { makeAutoObservable } from 'mobx'

export interface ICapsule {
  name: string
  email: string
  time: string
  content: string
  tip: string
  id?: string
  stat?: string
}

export interface ILoginUser {
  account: string
  pwd: string
}

export interface IRegisterUser {
  account: string
  pwd: string
  nickname?: string
  avatar?: string
}

export interface IArticle {
  _id: string
  title: string
  subTitle: string
  content: string
  tags: string
  banner: string
  ctime: string
  preview: number
}

export interface Info {
  author: {
    _id: string
    account: string
    nickname: string
    avatar: string
    status: number
    ctime: number
  }
  _id: string
  title: string
  subTitle: string
  tags: string
  content: string
  banner: string
  ctime: number
  preview: number
  status: number
}

export interface Detail {
  stat: string
  data: {
    info: Info
  }
}
