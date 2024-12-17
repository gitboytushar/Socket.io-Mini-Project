import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'

const app = express()

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
})

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  })
)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

io.on('connection', socket => {
  console.log('User connected... id -', socket.id)
  socket.emit('welcome', `Welcome to the Server... ${socket.id}`) // parameters -> function_name, message
  socket.broadcast.emit('welcome', `${socket.id} Joined the server...`) // parameters -> function_name, message
})

// do 'server.listen' to make sure that both the io and server is on same port
const port = 3000
server.listen(port, () => {
  console.log(`Server is running on Port ${port}...`)
})
