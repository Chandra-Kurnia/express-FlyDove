import { response, responseError } from '../helpers/response.js'
import userModels from '../models/userModels.js'
import bcrypt from 'bcrypt'
import { genAccessToken, genForgotPasswordToken } from '../helpers/jwt.js'
import sendEmailForgotPw from '../helpers/forgotpw.js'
import { v4 as uuidv4 } from 'uuid'
import path from 'path'
import fs from 'fs'

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
        avatar: '/avatar/user.jpg'
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

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = userModels.findUser(email)
    if (user.length > 0) {
      delete user[0].password
      const forgotpasswordtoken = await genForgotPasswordToken({ ...user[0] }, { expiresIn: 60 * 60 })
      sendEmailForgotPw(email, forgotpasswordtoken, user[0].name)
    } else {
      responseError(res, 'Error', 400, `can't find account with email : ${email} !`, [])
    }
  } catch (err) {
    next(err)
  }
}

const showUser = async (req, res, next) => {
  try {
    const { email } = req.params
    const user = await userModels.findUser(email)
    delete user[0].password
    if (user.length > 0) {
      response(res, 'Success', 200, 'Data successfully loaded', user[0])
    } else {
      responseError(res, 'Not Found', 404, 'User not found')
    }
  } catch (err) {
    next(err)
  }
}

const showUserbyid = async (req, res, next) => {
  try {
    const { id } = req.params
    const user = await userModels.findbyid(id)
    delete user[0].password
    if (user.length > 0) {
      response(res, 'Success', 200, 'Data successfully loaded', user[0])
    } else {
      responseError(res, 'Not Found', 404, 'User not found')
    }
  } catch (err) {
    next(err)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const userId = req.userLogin.user_id
    const email = req.userLogin.email
    let data = req.body

    if (data.avatar === '') {
      delete data.avatar
    }

    const user = await userModels.findUser(email)
    if (req.files) {
      const filename = uuidv4() + path.extname(req.files.avatar.name)
      const savePath = path.join(path.dirname(''), '/public/avatar', filename)
      data = { ...data, avatar: `/avatar/${filename}` }
      req.files.avatar.mv(savePath)
      if (user[0].avatar !== '/avatar/user.jpg') {
        fs.unlink(`./public/${user[0].avatar}`, (err) => {
          if (err) {
            return responseError(res, 'Error', 500, 'Error manage image', err)
          }
        })
      }
    }
    userModels.updateUser(data, userId)
      .then(async () => {
        const userAfterUpdate = await userModels.findUser(email)
        delete userAfterUpdate[0].password
        const accesstoken = await genAccessToken({ ...userAfterUpdate[0] }, { expiresIn: 60 * 60 })
        userAfterUpdate[0].token = accesstoken
        res.cookie('token', accesstoken, {
          httpOnly: true,
          secure: true,
          path: '/',
          sameSite: 'strict'
        })
        response(res, 'Success', 200, 'Update profile successfull', accesstoken)
      })
      .catch((err) => {
        responseError(res, 'Error', 500, 'Failed update profile, please try again later', err)
      })
  } catch (err) {
    next(err)
  }
}

const checktoken = async (req, res, next) => {
  const dataUser = req.userLogin
  response(res, 'Success', 200, 'User is valid', dataUser)
}

const getalluser = async (req, res, next) => {
  try {
    const userId = req.userLogin.user_id
    const dataUser = await userModels.getAllUser(userId)
    if (dataUser.length > 0) {
      response(res, 'Success', 200, 'All data users successfully loaded', dataUser)
    } else {
      response(res, 'Not user', 200, 'No user found', [])
    }
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    res.clearCookie('token')
    response(res, 'Success', 200, 'Logout Success')
  } catch (error) {
    responseError(res, 'Error', 500, 'failed logout', error)
  }
}

export default {
  register,
  login,
  forgotPassword,
  showUser,
  updateUser,
  checktoken,
  getalluser,
  showUserbyid,
  logout
}
