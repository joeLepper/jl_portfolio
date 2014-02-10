var express    = require('express')
  , fs         = require('fs')
  , app        = express()
  , server     = require('http').createServer(app)
  , reqHandle  = require('./server/request')
  , port       = process.argv[2] || 8888
  , io         = require('socket.io').listen(server)
  , yaml       = require('js-yaml').safeLoad(fs.readFileSync('./server/content.yml', 'utf8'));

server.listen(port);

app.use(express.static(__dirname + '/public'))
   .use(express.bodyParser());

app.get('/*', function(req,res){
  console.log('Service!');
	reqHandle.start(req,res);
});

io.set('log level', 0);

io.sockets.on('connection', function (socket) {
  console.log('SOCKET: client connected');
  socket.on('routeChange', function (data, callback) {
    console.log('ROUTE CHANGE');
    callback(yaml[data.route]);
  });
});
