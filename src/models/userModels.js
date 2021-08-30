import connection from '../configs/db.js'
import { promiseResolveReject } from '../helpers/response.js'

const register = (data) =>
  new Promise((resolve, reject) => {
    connection.query('insert into users set ?', data, (err, result) => {
      promiseResolveReject(resolve, reject, err, result)
    })
  })

const findUser = (email) =>
  new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM users WHERE email = '${email}'`, (err, result) => {
      promiseResolveReject(resolve, reject, err, result)
    })
  })

const updateUser = (data, userId) => new Promise((resolve, reject) => {
  connection.query('update users set ? where user_id = ?', [data, userId], (err, result) => {
    promiseResolveReject(resolve, reject, err, result)
  })
})

export default {
  register,
  findUser,
  updateUser
}
