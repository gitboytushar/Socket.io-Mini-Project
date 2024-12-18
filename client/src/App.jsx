import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import {
  Container,
  TextField,
  Typography,
  Button,
  Box,
  Stack
} from '@mui/material'

const App = () => {
  // create empty array of messages
  const [messagesArray, setMessagesArray] = useState([])

  const socket = useMemo(() => io('http://localhost:3000'), [])
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketID, setSocketID] = useState('')
  const [roomName, setRoomName] = useState('')

  // submit message
  const handleSubmit = e => {
    e.preventDefault()

    // pass both while emitting a message
    socket.emit('message', { message, room })

    // clear input fields after submit
    setMessage('')
    // setRoom('')
  }

  // join room
  const joinRoomHandler = e => {
    e.preventDefault()
    socket.emit('join-room', roomName)
    setRoomName('')
  }

  useEffect(() => {
    // prebuilt
    socket.on('connect', () => {
      setSocketID(socket.id)
      console.log('Connected...', socket.id)
    })

    socket.on('received_message', data => {
      console.log('data received:', data)
      // add messages to array
      setMessagesArray(message => [...message, data])
    })

    socket.on('welcome', s => {
      console.log(s)
    })

    // cleanup statement
    return () => {
      socket.disconnect()
      setSocketID('')
    }
  }, [])

  return (
    <Container
      maxWidth='xs'
      sx={{ mt: 5, py: 4, px: 2, boxShadow: 3, borderRadius: 5 }}
    >
      {/* heading */}
      <Typography
        variant='h4'
        component='div'
        gutterBottom
        sx={{
          pt: 3,
          textAlign: 'center',
          fontWeight: 'bold',
          color: 'Highlight'
        }}
      >
        Learning Socket.io
      </Typography>

      {/* current socket id */}
      <Typography
        variant='p'
        component='div'
        gutterBottom
        sx={{
          textAlign: 'center',
          color: 'black'
        }}
      >
        Your Id: {socketID}
      </Typography>

      {/* join room form */}
      <form onSubmit={joinRoomHandler}>
        <Box
          sx={{
            mx: 5,
            mb: 7,
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Typography
            variant='p'
            sx={{
              mt: 4,
              color: 'black',
              fontWeight: 'bold'
            }}
          >
            Join Room
          </Typography>
          <TextField
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            id='message'
            label='Enter Room Name'
            variant='outlined'
            fullWidth
          />
          <Button type='submit' variant='contained' color='inherit' fullWidth>
            Join
          </Button>
        </Box>
      </form>

      {/* input form */}
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ m: 5, mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            value={message}
            onChange={e => setMessage(e.target.value)}
            id='message'
            label='Your Message'
            variant='outlined'
            fullWidth
          />
          <TextField
            value={room}
            onChange={e => setRoom(e.target.value)}
            id='room'
            label='Joined Room Name / Private Room Id'
            variant='outlined'
            fullWidth
          />
          <Button type='submit' variant='contained' color='primary' fullWidth>
            Send
          </Button>
        </Box>
      </form>

      {/* messages stack */}
      <Box
        sx={{ mx: 5, mt: 0, display: 'flex', flexDirection: 'column', gap: 0 }}
      >
        <Typography
          variant='p'
          sx={{ fontWeight: 'bold', color: 'lightsteelblue' }}
        >
          Received Messages:
        </Typography>

        <Stack>
          {/* new message on top */}
          {[...messagesArray].reverse().map((m, i) => (
            <Typography key={i} variant='p' sx={{ color: 'black' }}>
              {m}
            </Typography>
          ))}
        </Stack>
      </Box>
    </Container>
  )
}

export default App
