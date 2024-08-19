const express = require('express')
const http = require('http')
const path = require('path')
const socket = require('socket.io')

const port = 3000
const app = express()

const server = http.createServer(app)
const io = socket(server)

app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', (socket) => {
  socket.on('send-location', (data) => {
    io.emit('recive-location', { id: socket.id, ...data })
  })

  socket.on('disconnect', () => {
    io.emit('user-disconnected', socket.id)
  })
})

app.get('/', (req, res) => {
  res.render('index')
})

server.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
