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
  const socket = useMemo(() => io('http://localhost:3000'), [])
  const [message, setMessage] = useState('')
  const [room, setRoom] = useState('')
  const [socketID, setSocketID] = useState('')

  // create empty array of messages
  const [messagesArray, setMessagesArray] = useState([])

  // submit message button
  const handleSubmit = e => {
    e.preventDefault()

    // pass both while emitting a message
    socket.emit('message', { message, room })

    // clear input fields after submit
    setMessage('')
    setRoom('')
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
      {/* topic */}
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

      {/* input form */}
      <form onSubmit={handleSubmit}>
        <Box
          sx={{ m: 5, mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}
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
            label='Room Id'
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
          {messagesArray.map((m, i) => (
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
