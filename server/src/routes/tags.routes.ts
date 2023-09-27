import { Router } from 'express'
import { getTags, saveTag } from '../controllers/tags.controller'
import { validateJWT } from '../middleware/validateJWT'
import { validateUser } from '../middleware/validateUser'

export const tagRouter: Router = Router()

tagRouter.post('/tag', validateJWT, validateUser, saveTag)
tagRouter.get('/tags/user', validateJWT, validateUser, getTags)
