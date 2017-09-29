var express = require('express'); // Express contains some boilerplate to for routing and such
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.use(express.static)

// Serve the index page
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

// Listen on port 5000
app.set('port', process.env.PORT || 5000);

http.listen(app.get('port'), function() {
  console.log('listening on port', app.get('port'));
});

let players = {};
let bullet_array = [];
// Tell Socket.io to start accepting connections
io.on('connection', function(socket) {
  console.log('New client has connected with id:', socket.id);
  socket.on('new-player', function(state) {
    console.log('The New Player has state: ', state);
    players[socket.id] = state;
    // console.log('in the socket', players[id]);
    io.emit('update-players', players);
  });

  // Listen for shoot-bullet events and add it to our bullet array
  socket.on('shoot-bullet', function(data) {
    if (players[socket.id] == undefined) {
      console.log('data', data);
      return;
    }
    var new_bullet = data;
    data.owner_id = socket.id; // Attach id of the player to the bullet
    bullet_array.push(new_bullet);
  });

  // Listen for move events and tell all other clients that something has moved
  socket.on('move-player', function(position_data) {
    //   console.log(players)
    if (players[socket.id] == undefined) return; // Happens if the server restarts and a client is still connected
    players[socket.id].x = position_data.x;
    players[socket.id].y = position_data.y;
    players[socket.id].angle = position_data.angle;
    io.emit('update-players', players);
  });

  socket.on('disconnect', function() {
    delete players[socket.id];
  });
});

// Update the bullets 60 times per frame and send updates
function ServerGameLoop() {
  for (var i = 0; i < bullet_array.length; i++) {
    var bullet = bullet_array[i];
    bullet.x += bullet.speed_x;
    bullet.y += bullet.speed_y;

        // Check if this bullet is close enough to hit any player 
        for(var id in players){
            if(bullet.owner_id != id){
              // And your own bullet shouldn't kill you
              var dx = players[id].x - bullet.x; 
              var dy = players[id].y - bullet.y;
              var dist = Math.sqrt(dx * dx + dy * dy);
              if(dist < 70){
                io.emit('player-hit',id); // Tell everyone this player got hit
              }
            }
          }

    // Remove if it goes too far off screen
    if (
      bullet.x < -10 ||
      bullet.x > 1000 ||
      bullet.y < -10 ||
      bullet.y > 1000
    ) {
      bullet_array.splice(i, 1);
      i--;
    }
  }
  io.emit('bullets-update', bullet_array);
}

setInterval(ServerGameLoop, 16);
