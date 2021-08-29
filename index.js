import Express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'
import morgan from 'morgan'
import { responseError } from './src/helpers/response.js'
import fileUpload from 'express-fileupload'
import path from 'path'
import 'dotenv/config'

// Router
import userRouter from './src/routes/user.js'

// Configuration
const port = process.env.API_PORT || 4000
const app = Express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*'
  }
})
const corsSetting = {
  credentials: true,
  origin: 'http://localhost:3000'
}
app.use(cors(corsSetting))
app.use(morgan('dev'))
app.use(Express.json())
app.use(fileUpload())
app.use('/images', Express.static(path.resolve('./public/images/')))
app.use('/avatar', Express.static(path.resolve('./public/avatars/')))

// REST API
app.use('/user', userRouter)

// CHAT SERVER

app.use('*', (req, res, next) => {
  next(new Error('Endpoint Not Found'))
})

app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, [])
})

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
