import { FindOptions, ObjectId, WithId } from 'mongodb'
import * as db from '../db'
import { IUser, Status } from '../types'
import { check, Error } from '../libs/check'
import { tokenKit } from '.'

async function add(account: string, pwd: string) {
  let user = await db.userCollection.findOne({
    account,
  })
  check(!!!user, 'Err_User_Exist')
  let now = new Date().getTime()
  let newUser: IUser = {
    account,
    pwd,
    nickname: '',
    ctime: now,
    status: Status.normal,
    avatar: '',
  }
  let result = await db.userCollection.insertOne(newUser)
  return result.insertedId
}

async function findOne(id: string, hasPwd: boolean = false) {
  let user = await db.userCollection.findOne<WithId<IUser>>(
    {
      _id: new ObjectId(id),
      status: Status.normal,
    },
    { projection: { pwd: hasPwd ? 1 : 0 } },
  )
  check(!!user, 'Err_User_Not_Found')
  return user
}

async function findOneByAccount(account: string, pwd: string) {
  let user = await db.userCollection.findOne({
    account,
    pwd,
    status: Status.normal,
  })
  check(!!user, 'Err_User_Not_Found')
  return user
}

async function remove(id: string) {
  let result = await db.userCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    {
      $set: { status: Status.delete },
    },
  )
  check(!!result, 'Err_User_Not_Found')
}

async function search() {}

async function updatePwd(id: string, oldPwd: string, newPwd: string) {
  let user = await findOne(id, true)
  check(user.pwd == oldPwd, 'Err_Pwd_Not_Right')
  await tokenKit.removeTokenByUserId(id)
  await db.userCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    { $set: { pwd: newPwd } },
  )
}

async function updateUserInfo(id: string, nickname: string, avatar: string) {
  let user = await findOne(id)
  await db.userCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
    },
    { $set: { avatar, nickname } },
  )
}

export { add, findOne, remove, updateUserInfo, updatePwd, findOneByAccount }
