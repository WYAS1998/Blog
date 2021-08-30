import * as Router from 'koa-router'
import { Context } from 'koa'
import { catchError, check, generateOk } from '../libs/check'
import { tokenKit, userKit } from '../kits'

const router = new Router({
  prefix: '/api/auth',
})

router.post('/registry', async (ctx: Context) => {
  try {
    const { account, pwd } = ctx.request.body as {
      account: string
      pwd: string
    }
    // check data
    let user = await userKit.add(account, pwd)
    let token = await tokenKit.add(account, pwd)
    ctx.cookies.set('token', token.toString(), {
      httpOnly: true, // 是否只用于http请求中获取
      overwrite: false, // 是否允许重写
    })
    ctx.body = generateOk(user.toString())
  } catch (err) {
    catchError(err, ctx)
  }
})

router.post('/login', async (ctx: Context) => {
  try {
    const { account, pwd } = ctx.request.body as {
      account: string
      pwd: string
    }
    // check data
    let token = await tokenKit.add(account, pwd)
    ctx.cookies.set('token', token.toString(), {
      httpOnly: true, // 是否只用于http请求中获取
      overwrite: false, // 是否允许重写
    })
    ctx.body = generateOk({
      token,
    })
  } catch (err) {
    catchError(err, ctx)
  }
})

router.post('/logout', async (ctx: Context) => {
  try {
    let token = ctx.cookies.get('token')
    check(!!token)
    let tokenCol = await tokenKit.findOne(token)
    check(!!tokenCol)
    tokenKit.removeToken(token)
    ctx.body = generateOk()
  } catch (err) {
    catchError(err, ctx)
  }
})

export default router
