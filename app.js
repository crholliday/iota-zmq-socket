'use strict'
const config = require('./config')
const app = require('express')()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const zmq = require('zeromq')

const maxSeconds = 5
let interval = 0
let counter = 0
let attempts = 0

server.listen(config.bind_port, () => {
    console.log('Listening on port ', config.bind_port)
})

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

io.on('connection', (socket) => {
    socket.emit('info', {hello: 'world'})
    let sock = zmq.socket('sub')

    sock.connect('tcp://' + config.zmq_url)
    sock.subscribe('')

    console.info('Subscriber connected to port 5556')

    sock.on('message', function(topic) {
        let arr = topic.toString().split(' ')
        socket.emit('msg', arr)
        counter++
    })

    setInterval(() => {
        if (interval === counter) {
            attempts++
            console.log('Closing the sockets due to inactivity for ', maxSeconds, ' seconds')
            console.log('Attempt #: ', attempts)
            sock.disconnect('tcp://' + config.zmq_url)
            sock.connect('tcp://' + config.zmq_url)
            sock.subscribe('')

        } else {
            interval = counter
        }
    }, maxSeconds * 1000)
})

