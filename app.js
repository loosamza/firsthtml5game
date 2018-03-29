var express = require('express')
var app = express()
var serv = require('http').Server(app)
var path = require('path')
// Load the full build.
var _ = require('lodash')
// Load the core build.
var _ = require('lodash/core')
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'))
})

app.use('/client', express.static(path.join(__dirname, '/client')))

serv.listen(2000)
console.log('Server started.')

var SOCKET_LIST = {}
var io = require('socket.io')(serv, {})
io.sockets.on('connection', (socket) => {
  socket.id = Math.random()
  socket.x = 0
  socket.y = 0
  socket.number = '' + Math.floor(10 * Math.random())
  SOCKET_LIST[socket.id] = socket

  socket.on('disconnect', () => {
    delete SOCKET_LIST[socket.id]
  })
})

setInterval(() => {
  var pack = []
  for (var i in SOCKET_LIST) {
    var socket = SOCKET_LIST[i]
    socket.x++
    socket.y++
    pack.push({
      x: socket.x,
      y: socket.y,
      number: socket.number
    })
  }
  for (var j in SOCKET_LIST) {
    socket.emit('newPositions', pack)
  }
}, 40)
