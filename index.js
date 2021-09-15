/* eslint-disable node/no-callback-literal */
import Express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'
import morgan from 'morgan'
import { responseError } from './src/helpers/response.js'
import fileUpload from 'express-fileupload'
import path from 'path'
import 'dotenv/config'
import Jwt from 'jsonwebtoken'
import messageModels from './src/models/messageModels.js'

// Router
import userRouter from './src/routes/user.js'
import messageRouter from './src/routes/message.js'

// Configuration
const port = process.env.PORT || 4000
const app = Express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})
const corsSetting = {
  credentials: true,
  origin: 'https://skydove.vercel.app'
  // origin: 'https://6140bf8f35ec7e6018886ce8--stoic-booth-1cd8c1.netlify.app'
  // origin: 'http://localhost:3000'
  // origin: '*'
}
app.use(cors(corsSetting))
app.use(morgan('dev'))
app.use(Express.json())
app.use(fileUpload())
app.use('/images', Express.static(path.resolve('./public/images/')))
app.use('/avatar', Express.static(path.resolve('./public/avatar/')))

// REST API
app.use('/user', userRouter)
app.use('/messages', messageRouter)

// CHAT SERVER
io.use((socket, next) => {
  try {
    const token = socket.handshake.query.token
    const accessToken = token.slice(6)
    if (!accessToken) {
      return new Error('Socket need access token')
    }
    Jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET_KEY, (err, decode) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return new Error('Token is expired')
        }
        if (err.name === 'JsonWebTokenError') {
          return new Error('Token is invalid')
        }
        return new Error('Token is not active')
      }
      socket.user_id = decode.user_id
      socket.join(decode.user_id)
      next()
    })
  } catch (error) {
    next(error)
  }
})

io.on('connection', (socket) => {
  console.log(`User id = ${socket.user_id} online with socket id : ${socket.id}`)

  socket.on('sendmsg', (data, cb) => {
    const dataMsg = {
      sender_id: socket.user_id,
      recipient_id: data.recipient_id,
      message: data.message
    }
    messageModels
      .sendMessage(dataMsg)
      .then(() => {
        messageModels.lastSend(socket.user_id).then((res) => {
          const MsgId = res[0].latest
          cb({
            recipient_id: data.recipient_id,
            sender_id: socket.user_id,
            message: data.message,
            time: new Date(),
            message_id: MsgId
          })
          socket.broadcast
            .to(data.recipient_id)
            .emit('msgFromBackEnd', {
              message: data.message,
              time: new Date(),
              sender_id: socket.user_id,
              sender_name: data.sender_name,
              message_id: MsgId
            })
        })
      })
      .catch(() => {
        socket.broadcast
          .to(data.recipient_id)
          .emit('msgFromBackEnd', { message: 'message invalid', time: new Date(), sender_id: socket.user_id })
      })
  })

  socket.on('disconnect', () => {
    console.log('someone offline')
  })
})

app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'))
})

app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, [])
})

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
