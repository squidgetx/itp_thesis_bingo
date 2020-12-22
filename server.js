// Create server
let port = process.env.PORT || 8000;
let express = require('express');
let app = express();
let server = require('http').createServer(app).listen(port, function () {
  console.log('Server listening at port: ', port);
});

// Tell server where to look for files
app.use(express.static('public'));

let users = {};

// Create socket connection
let io = require('socket.io').listen(server);
// Listen for individual clients to connect
io.sockets.on('connection',
  // Callback function on connection
  function (socket) {
    console.log("We have a new client: " + socket.id);
    users[socket.id] = 'Anonymous'
  
    // Listen for name messages
    socket.on('name', function (data) {
      // tell everyone about the new name
      users[socket.id] = data
      io.emit('name', [socket.id, data])
    });
  
    socket.on('score', function (data) {
      // tell everyone about the new score
      io.emit('score', [socket.id, data])
    });
  
    socket.on('win', function (data) {
      // tell everyone about the new name
      io.emit('win', [socket.id, data])
    });

    // Listen for this client to disconnect
    // Tell everyone client has disconnected
    socket.on('disconnect', function() {      
      delete users[socket.id]
      io.emit('disconnect', socket.id)
    });
  
    io.emit('connected', socket.id)
    socket.emit('names', users)

  });


