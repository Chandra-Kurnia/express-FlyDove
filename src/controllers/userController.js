import { response, responseError } from '../helpers/response.js'
import userModels from '../models/userModels.js'
import bcrypt from 'bcrypt'
import { genAccessToken } from '../helpers/jwt.js'

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await userModels.findUser(email)
    if (user.length > 0) {
      bcrypt.compare(password, user[0].password, async (err, result) => {
        if (!err) {
          if (result) {
            delete user[0].password
            const accesstoken = await genAccessToken({ ...user[0] }, { expiresIn: 60 * 60 })
            user[0].token = accesstoken
            res.cookie('token', accesstoken, {
              httpOnly: true,
              // maxAge: 60 * 60 * 60,
              secure: true,
              path: '/',
              sameSite: 'strict'
            })
            response(res, 'Success', 200, 'Login successfull', user[0])
          } else {
            responseError(res, 'wrong password', 400, 'Your password  is wrong', [])
          }
        } else {
          responseError(res, 'Bcrypt Error', 500, 'Login failed, please try again later', err)
        }
      })
    } else {
      responseError(res, 'Error', 400, 'Your email not found!', [])
    }
  } catch (err) {
    next(err)
  }
}

export default {
  register,
  login
}
