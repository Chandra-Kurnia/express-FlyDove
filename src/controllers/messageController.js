import { response, responseError } from '../helpers/response.js'
import messageModels from '../models/messageModels.js'

const sendMessage = (req, res, next) => {
  const data = req.body
  messageModels
    .sendMessage(data)
    .then(() => {
      response(res, 'Success', 200, 'Message succesfully stored')
    })
    .catch((err) => {
      responseError(res, 'Error', 500, 'Failed store chat, please try again later', err)
    })
}

const getMessage = async (req, res, next) => {
  try {
    const userId = req.userLogin.user_id
    const recipientId = req.params.recipientId
    const messages = await messageModels.getMessages(userId, recipientId)
    if (messages.length > 0) {
      response(res, 'success', 200, 'All messages successfully loaded', messages)
    } else {
      response(res, 'No message', 200, 'Message not found', [
        // { message: 'You dont have chat with this user', sender_id: userId },
        // { message: 'Say hi!, and start messaging :D', sender_id: userId }
      ])
    }
  } catch (err) {
    next(err)
  }
}

const deleteMessage = (req, res, next) => {
  const messageId = req.params.id
  messageModels.deleteMessage(messageId)
    .then(() => {
      response(res, 'Success', 200, 'Message successsfully deleted')
    })
    .catch((err) => {
      responseError(res, 'Error', 500, 'Failed deleted message', err)
    })
}

export default {
  sendMessage,
  getMessage,
  deleteMessage
}
