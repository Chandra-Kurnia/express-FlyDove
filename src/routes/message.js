import Express from 'express'
import messageController from '../controllers/messageController.js'
import { Auth } from '../middlewares/auth.js'

const router = Express.Router()

router.post('/send', messageController.sendMessage)
  .get('/getmessages/:recipientId', Auth, messageController.getMessage)
  .delete('/delete/:id', messageController.deleteMessage)

export default router
