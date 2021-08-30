import axios from 'axios'
import { ILoginUser, IRegisterUser, IArticle, Detail } from '../types'

interface BaseRes {
  id: string // 添加成功后返回的token
  stat: string
  data: {
    token: string
    account: string
    avatar: string
    nickname: string
    items: IArticle[]
    total: number
  }
}
interface UserInfo {
  nickname: string
  avatar: string
}
interface UserPwd {
  oldPwd: string
  newPwd: string
}
interface Page {
  pageIndex: number
  pageSize: number
  keyword: string
}

// 登录
export async function login(data: ILoginUser) {
  let result = await axios.post<BaseRes>('/api/auth/login', data)
  return result.data
}
// 退出
export async function logout() {
  let result = await axios.post<BaseRes>('/api/auth/logout')
  return result.data
}
// 注册
export async function register(data: IRegisterUser) {
  let result = await axios.post<BaseRes>('/api/auth/registry', data)
  // console.log(data)
  // console.log(result)
  return result.data
}
// 查询用户登录状态
export async function userInfo() {
  let result = await axios.get<BaseRes>('/api/user/userInfo')
  // console.log(token)
  // console.log(result)
  return result.data
}
// 修改用户头像、昵称
export async function updateUserInfo(data: UserInfo) {
  let result = await axios.put<BaseRes>('/api/user/updateUserInfo', data)
  // console.log(result)
  return result.data
}
// 修改密码
export async function updatePwd(data: UserPwd) {
  let result = await axios.put<BaseRes>('/api/user/updatePwd', data)
  // console.log(result)
  return result.data
}
// 查询自己的文章
export async function searchOwner(data: Page) {
  let result = await axios.post<BaseRes>('/api/article/searchOwner', data)
  return result.data
}
// 添加文章
export async function addArticle(data: IArticle) {
  let result = await axios.post<BaseRes>('/api/article/add', data)
  return result.data
}
// 删除文章
export async function deleteArticle(data: IArticle) {
  let result = await axios.delete<BaseRes>(`/api/article/${data._id}`)
  return result.data
}
// 编辑文章
export async function editArticle(data: IArticle) {
  // console.log(data);
  let result = await axios.put<BaseRes>(`/api/article/${data._id}`, data)
  return result.data
}
// 查询所有文章
export async function searchAll(data: Page) {
  let result = await axios.post<BaseRes>('/api/article/searchAll', data)
  return result.data
}
// 增加preview
export async function preview(data: IArticle) {
  let result = await axios.get<Detail>(`/api/article/${data._id}`)
  return result.data
}
