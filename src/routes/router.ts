import { Request, Response, Router } from "express";
import * as loginController from '../controllers/loginController'
import * as chatController from '../controllers/chatController'
import {privateRoute} from '../config/passport'

const router = Router()

router.get('/', loginController.redirect)
router.get('/login', loginController.loginPage)
router.post('/login',loginController.login)
router.get('/register' , loginController.registerPage)
router.post('/register', loginController.register)
router.get('/chat', privateRoute, chatController.chat)

export default router