import Express from 'express'
import userController from '../controllers/userController.js'
import userValidaton from '../validations/userValidation.js'
import resultValidation from '../validations/ResultOfValidation.js'

const router = Express.Router()

router.post('/register', userValidaton.registerFieldRules(), resultValidation, userController.register)
  .get('/show/:email', userController.showUser)
  .post('/login', userValidaton.loginFieldRules(), resultValidation, userController.login)
  .post('/forgotpassword', userValidaton.forgotPasswordFieldRules(), resultValidation)
  .post('/updateuser', userController.updateUser)

export default router
