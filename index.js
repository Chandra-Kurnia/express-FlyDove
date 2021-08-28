import Express from 'express'
import { Server } from 'socket.io'
import { createServer } from 'http'
import cors from 'cors'
import morgan from 'morgan'
import { responseError } from './src/helpers/response.js'

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
app.use(cors())
app.use(morgan('dev'))

// REST API
app.use('/user', userRouter)

// CHAT SERVER

app.use((err, req, res, next) => {
  responseError(res, 'Error', 500, err.message, [])
})

httpServer.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
