var express    = require('express')
  , app        = express()
  , server     = require('http').createServer(app)
  , database   = require('./server/database')
  , reqHandle  = require('./server/request')
  , port       = process.argv[2] || 8888
  , socket     = require('./server/sockets').init
  , io         = require('socket.io').listen(server);

server.listen(port);

app.use(express.static(__dirname + '/public'))
   .use(express.bodyParser());

app.get('/*', function(req,res){
  console.log('Service!');
	reqHandle.start(req,res);
});

app.post('/level', function(req,res){
  // console.log('SOCKET: emitting resistance of ' + req.body.resistance);
  var params = { resistance : req.body.resistance
               , time       : Date.now( ) };
  database.create(params, res.send);
  io.sockets.emit('resistance', params );
  res.send(200);
});

io.set('log level', 0);

io.sockets.on('connection', function (socket) {
  console.log('SOCKET: client connected');
  socket.on('bulkRequest', function (data, callback) {
    console.log('BULK REQUEST');
    database.batchLookup(data, callback);
  });
});
