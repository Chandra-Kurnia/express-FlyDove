import Express from 'express'
import userController from '../controllers/userController.js'
import userValidaton from '../validations/userValidation.js'
import resultValidation from '../validations/ResultOfValidation.js'
import { Auth } from '../middlewares/auth.js'

const router = Express.Router()

router.post('/register', userValidaton.registerFieldRules(), resultValidation, userController.register)
  .get('/show/:email', userController.showUser)
  .get('/showbyid/:id', userController.showUserbyid)
  .post('/login', userValidaton.loginFieldRules(), resultValidation, userController.login)
  .post('/forgotpassword', userValidaton.forgotPasswordFieldRules(), resultValidation)
  .post('/updateuser', Auth, userController.updateUser)
  .get('/checktoken', Auth, userController.checktoken)
  .get('/getallusers', Auth, userController.getalluser)
  .get('/logout', userController.logout)
  .get('/userinchat', Auth, userController.getUserInchat)

export default router
