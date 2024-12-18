import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import cookieParser from 'cookie-parser'

const app = express()

const server = createServer(app)

const port = 3000
const secretKeyJWT = 'asdjaflbsadbfdfasdjkbf'

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

// default path
app.get('/', (req, res) => {
  res.send('Hello to Socket.IO')
})

// login api, using jwt and cookie-parser packages ------- Note
app.get('/login', (req, res) => {
  const token = jwt.sign({ _id: 'asdjaflbsadbfdfasdjkbf' }, secretKeyJWT)

  res
    .cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' })
    .json({ message: 'Login Success' })
})

// middleware: connect user after a condition | jwt and cookie-parser used
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, err => {
    if (err) return next(err)

    const token = socket.request.cookies.token

    if (!token) return next(new Error('Authentication Error'))

    const decoded = jwt.verify(token, secretKeyJWT)

    next()
  })
})

// main circuit
io.on('connection', socket => {
  console.log('User connected...', socket.id)

  // send message event
  socket.on('message', ({ room, message }) => {
    console.log({ room, message })
    //  io.emit('received_message', data) // this show the message to all the sockets, because io is the circuit
    //  socket.broadcast.emit('received_message', data) // this will only show the message to other not-me

    //  send message to particular socket id, by using rooms in socket.io
    socket.to(room).emit('received_message', message) // works same as below, when to() is used
    //  io.to(room).emit('received_message', message)
  })

  // disconnect event
  socket.on('disconnect', () => {
    console.log('User disconnected...', socket.id)
  })

  // join room event
  socket.on('join-room', room => {
    socket.join(room)
    console.log(`User ${socket.id} - joined Room: ${room}`)
  })
})

// do 'server.listen' to make sure that both the io and server is on same port
server.listen(port, () => {
  console.log(`Server is running on Port ${port}...`)
})
