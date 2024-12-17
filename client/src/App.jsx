import React, { useEffect } from 'react'
import { io } from 'socket.io-client'

const App = () => {
  const socket = io('http://localhost:3000')

  // pre built event in sockets.io
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected... id -', socket.id)
    })

    socket.on('welcome', s => {
      console.log(s)
    })
  }, [])

  return <div>App</div>
}

export default App
