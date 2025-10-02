import {Router, Response, Request} from 'express'

import { CreateUserController } from './controllers/user/CreateUserController'
import { AuthUserController } from './controllers/user/AuthUserControlle'

const router = Router()

/* rotas user */
router.post("/users", new CreateUserController().handle)

router.post("/session", new AuthUserController().handle)
export { router }