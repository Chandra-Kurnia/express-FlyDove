import { response, responseError } from '../helpers/response.js'
import userModels from '../models/userModels.js'
import bcrypt from 'bcrypt'

const register = async (req, res, next) => {
  try {
    const { name, email } = req.body
    const checkExistUser = await userModels.findUser(email)
    if (checkExistUser.length > 0) {
      responseError(res, 'error', 400, 'Email already registered', [])
    } else {
      const salt = await bcrypt.genSalt(10)
      const form = {
        name,
        email,
        password: await bcrypt.hash(req.body.password, salt),
        avatar: '/public/avatar/user.png'
      }
      userModels
        .register(form)
        .then(() => {
          response(res, 'succes', 200, 'Register success, now you can login with your account')
        })
        .catch((err) => {
          responseError(res, 'Error', 500, 'Failed register, please try again later', err)
        })
    }
  } catch (error) {
    next(error)
  }
}

export default {
  register
}
