import { ObjectId } from 'mongodb'
import * as db from '../db'
import { IArticle, Status } from '../types'
import { check, Error } from '../libs/check'
import { userKit } from '.'

async function add(record: IArticle) {
  let result = await db.articleCollection.insertOne({
    ...record,
    status: Status.normal,
  })
  return result.insertedId
}

async function findOne(id: string, author: string = '') {
  let article = await db.articleCollection.findOne({
    _id: new ObjectId(id),
    status: Status.normal,
    author: { $regex: author },
  })
  check(!!article, 'Err_Article_Not_Found')
  return article
}

async function remove(id: string, uid: string) {
  let result = await db.articleCollection.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      author: uid,
    },
    {
      $set: { status: Status.delete },
    },
  )
  check(!!result, 'Err_Article_Not_Found')
}

async function search(
  keyword: string,
  pageIndex: number,
  pageSize: number,
  sort: 'ctime' | 'preview',
  author: string = '',
) {
  const docs = db.articleCollection
    .find({
      status: Status.normal,
      $or: [
        { title: { $regex: keyword || '' } },
        { subtitle: { $regex: keyword || '' } },
        { content: { $regex: keyword || '' } },
        { tags: { $regex: keyword || '' } },
      ],
      author: { $regex: author },
    })
    .sort({ [sort]: -1 })
  let total = await docs.count()
  let _items = await docs
    .limit(pageSize)
    .skip((pageIndex - 1) * pageSize)
    .toArray()
  let items = await Promise.all(
    _items.map(async (item) => {
      return { ...item, author: await userKit.findOne(item.author) }
    }),
  )
  return {
    items,
    total: total,
  }
}

async function update(
  id: string,
  title: string,
  subTitle: string,
  content: string,
  tags: string,
  uid: string,
) {
  let article = await findOne(id, uid)
  article = {
    ...article,
    title,
    subTitle,
    content,
    tags,
    mtime: new Date().getTime(),
  }
  await db.articleCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: article,
    },
  )
}

async function preview(id: string) {
  let article = await findOne(id)
  article.preview += 1
  await db.articleCollection.findOneAndUpdate(
    { _id: new ObjectId(id) },
    {
      $set: article,
    },
  )
  let newArt = {
    ...article,
    author: await userKit.findOne(article.author),
  }
  return newArt
}

export { search, add, update, remove, findOne, preview }
