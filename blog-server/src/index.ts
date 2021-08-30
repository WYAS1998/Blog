import * as Koa from 'koa'
import router from './route'
import * as db from './db'
import config from './config'
import * as koaBody from 'koa-body'

const app = new Koa()

app.use(async (ctx, next) => {
  let start = Date.now()
  await next()
  let time = Date.now() - start
  ctx.set('X-Response-Time', time + 'ms')
})
app.use(
  koaBody({
    multipart: true,
    formidable: {
      maxFileSize: config.uploadSizeLimit,
    },
  }),
)
app.use(router.routes())
db.connect().then(() =>
  app.listen(config.port, () => {
    console.log(`start:${config.port}`)
  }),
)
