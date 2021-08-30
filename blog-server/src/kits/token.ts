import { ObjectId } from 'mongodb'
import * as db from '../db'
import { check, Error } from '../libs/check'
import { userKit } from '.'

async function add(account: string, pwd: string) {
  let user = await userKit.findOneByAccount(account, pwd)
  await removeTokenByUserId(user._id.toString())
  let result = await db.tokenCollection.insertOne({
    userId: user._id.toString(),
  })
  return result.insertedId
}

async function findOne(id: string) {
  let token = await db.tokenCollection.findOne({
    _id: new ObjectId(id),
  })
  check(!!token, 'Err_Token_Not_Found')
  return token
}

async function removeToken(id: string) {
  let result = await db.tokenCollection.deleteOne({
    _id: new ObjectId(id),
  })
  return result.deletedCount
}

async function removeTokenByUserId(uid: string) {
  await db.tokenCollection.deleteOne({
    userId: uid,
  })
}

export { add, removeToken, findOne, removeTokenByUserId }
