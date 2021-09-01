import Jwt from 'jsonwebtoken'
import { response, responseError } from '../helpers/response.js'

export const Auth = (req, res, next) => {
  try {
    const Token = req.headers.cookie
    if (Token === undefined) {
      return response(res, 'NOT LOGIN', 400, 'USER NOT LOGIN', [])
    }
    const accessToken = Token.slice(6)
    if (!accessToken) {
      return responseError(res, 'Authorized failed', 400, 'Server need accessToken', [])
    }
    Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decode) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return responseError(res, 'Authorized failed', 400, 'token expired', [])
        }
        if (err.name === 'JsonWebTokenError') {
          return responseError(res, 'Authorized failed', 400, 'token invalid', [])
        }
        return responseError(res, 'Authorized failed', 400, 'token not active', [])
      }
      req.userLogin = decode
      next()
    })
  } catch (error) {
    next(error)
  }
}
