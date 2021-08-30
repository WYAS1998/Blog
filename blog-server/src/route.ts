import * as Router from 'koa-router'
// import tagConsoleRouter from './routes/tag.console.router'
import articleRoute from './routes/article.router'
import authRoute from './routes/auth.router'
import userRoute from './routes/user.router'
import fileRoute from "./routes/file.router"

const router = new Router()
router.use(articleRoute.routes())
router.use(authRoute.routes())
router.use(userRoute.routes())
router.use(fileRoute.routes())

export default router
