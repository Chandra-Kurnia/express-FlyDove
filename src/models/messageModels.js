import connection from '../configs/db.js'
import { promiseResolveReject } from '../helpers/response.js'

const sendMessage = (data) =>
  new Promise((resolve, reject) => {
    connection.query('insert into messages set ?', data, (err, result) => {
      promiseResolveReject(resolve, reject, err, result)
    })
  })

const getMessages = (userId, recipientId) =>
  new Promise((resolve, reject) => {
    connection.query(
      `select * from messages where (sender_id = ${userId} and recipient_id = ${recipientId}) or (sender_id = ${recipientId} and recipient_id = ${userId})`,
      (err, result) => {
        promiseResolveReject(resolve, reject, err, result)
      }
    )
  })

const deleteMessage = (messageId) =>
  new Promise((resolve, reject) => {
    connection.query(`delete from messages where message_id = ${messageId}`, (err, result) => {
      promiseResolveReject(resolve, reject, err, result)
    })
  })

const lastSend = (senderId) =>
  new Promise((resolve, reject) => {
    connection.query(
      `select LAST_INSERT_ID(message_id) as latest from messages where sender_id = ${senderId} order by message_id desc`,
      (err, result) => {
        promiseResolveReject(resolve, reject, err, result)
      }
    )
  })

export default {
  sendMessage,
  getMessages,
  deleteMessage,
  lastSend
}
