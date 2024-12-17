import React, { useEffect, useMemo, useState } from 'react'
import { io } from 'socket.io-client'
import { Container, TextField, Typography, Button } from '@mui/material'

const App = () => {
  const socket = useMemo(() => io('http://localhost:3000'), [])

  const [message, setMessage] = useState('')

  const handleSubmit = e => {
    e.preventDefault()
    socket.emit('message', message)
    setMessage('')
  }

  // pre built event in sockets.io
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected...', socket.id)
    })

    socket.on('welcome', s => {
      console.log(s)
    })

    // to show user-disconnected we use cleanup statement
    return () => {
      socket.disconnect()
    }
  }, [])

  return (
    <Container maxWidth='sm'>
      <Typography variant='h3' component='div' gutterBottom>
        Learning Socket.io
      </Typography>

      {/* basic form to send message */}
      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={e => setMessage(e.target.value)}
          id='outlined-basic'
          label='Outlined'
          variant='outlined'
        />
        <Button type='submit' variant='contained' color='primary'>
          Send
        </Button>
      </form>
    </Container>
  )
}

export default App
