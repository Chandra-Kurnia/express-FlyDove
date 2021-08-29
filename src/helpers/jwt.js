import Jwt from 'jsonwebtoken'

export const genAccessToken = (payload, option) => new Promise((resolve, reject) => {
  Jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET_KEY, { ...option }, (err, token) => {
    if (err) {
      console.log(err)
      reject(err)
    }
    resolve(token)
  })
})
