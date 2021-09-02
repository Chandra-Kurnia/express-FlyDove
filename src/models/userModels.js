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

const findbyid = (id) =>
  new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM users WHERE user_id = '${id}'`, (err, result) => {
      promiseResolveReject(resolve, reject, err, result)
    })
  })

const updateUser = (data, userId) => new Promise((resolve, reject) => {
  connection.query('update users set ? where user_id = ?', [data, userId], (err, result) => {
    promiseResolveReject(resolve, reject, err, result)
  })
})

const getAllUser = (userId) => new Promise((resolve, reject) => {
  connection.query(`select * from users except select * from users where user_id = ${userId}`, (err, result) => {
    promiseResolveReject(resolve, reject, err, result)
  })
})

const getUserInchat = (userLoginId, userId) => new Promise((resolve, reject) => {
  connection.query(`select (select user_id from users where user_id = recipient_id) as user_id, (select avatar from users where user_id = recipient_id) as avatar, (select name from users where user_id = recipient_id) as name, (select username from users where user_id = recipient_id) as username, (select online from users where user_id = recipient_id) as online, (select count(*) from messages where (sender_id = ${userLoginId} and recipient_id = ${userId} and unread = 1) or (sender_id = ${userId} and recipient_id = ${userLoginId} and unread = 1)) as unread, message, time from messages where (sender_id = ${userLoginId} and recipient_id = ${userId}) or (sender_id = ${userId} and recipient_id = ${userLoginId}) order by time desc limit 1`, (err, result) => {
    promiseResolveReject(resolve, reject, err, result)
  })
})

export default {
  register,
  findUser,
  updateUser,
  getAllUser,
  findbyid,
  getUserInchat
}
