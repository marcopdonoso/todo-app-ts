import { Router } from 'express'
import {
  deleteTag,
  getTagsByUser,
  saveTag,
  updateTag
} from '../controllers/tags.controller'
import { validateJWT } from '../middleware/validateJWT'
import { validateUser } from '../middleware/validateUser'

export const tagRouter: Router = Router()

tagRouter.post('/tag', validateJWT, validateUser, saveTag)
tagRouter.get('/tags/user', validateJWT, validateUser, getTagsByUser)
tagRouter.delete('/tag/:tagId', validateJWT, validateUser, deleteTag)
tagRouter.put('/tag/:tagId', validateJWT, validateUser, updateTag)
