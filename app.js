'use strict'
const config = require('./config')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const zmq = require('zeromq')

server.listen(config.bind_port, () => {
    console.log('Listening on port ', config.bind_port)
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    socket.emit('news', {
        hello: 'world'
    })

    console.info('Somebody connected to the socket...')
    socket.emit('info', {hello: 'world'})
    // subber.js
    let sock = zmq.socket('sub')

    sock.connect('tcp://' + config.zmq_url)
    sock.subscribe('')

    console.info('Subscriber connected to port 5556')

    sock.on('message', function(topic) {
        let arr = topic.toString().split(' ')
        socket.emit('msg', arr)
    })
})
