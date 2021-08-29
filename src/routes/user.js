import Express from 'express'
import userController from '../controllers/userController.js'
import userValidaton from '../validations/userValidation.js'
import resultValidation from '../validations/ResultOfValidation.js'

const router = Express.Router()

router.post('/register', userValidaton.registerFieldRules(), resultValidation, userController.register)
  .post('/login', userValidaton.loginFieldRules(), resultValidation, userController.login)

export default router
