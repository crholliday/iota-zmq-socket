const path = require('path')
global.rootPath = path.normalize(path.join(__dirname, '..', '..'))

module.exports = {
    zmq_url: 'localhost:5556',
    bind_port: '8091'
}
