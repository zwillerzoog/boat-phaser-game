const express = require('express'); // Express contains some boilerplate to for routing and such
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http); // Here's where we include socket.io as a node module

// Serve the index page
// app.get("/", function (request, response) {
//   response.sendFile(__dirname + '/index.html');
// });

// Serve the assets directory
app.use(express.static('public'));
app.use('/assets', express.static('assets'));

// Listen on port 5000
app.set('port', process.env.PORT || 5000);
http.listen(app.get('port'), function() {
    console.log('listening on port', app.get('port'));
});

let players = {}; //Keeps a table of all players, the key is the socket id
let bullet_array = [];
let health = 100; // Keeps track of all the bullets to update them on the server
let zombies = {};
let startTime = new Date();
let time;

// Tell Socket.io to start accepting connections
io.on('connection', function(socket) {
    // console.log(Object.keys(io.sockets.connected).length)
    time = startTime.getTime();

    // if(!time) {
    //     time = new Date().getTime()
    // }
    
    // console.log('TIME', time)
    // socket.emit('start-time', time)

    //Listen for new messages
    socket.on('chat message', function(msg) {
        io.emit('chat message', msg);
    });

    // Listen for a new player trying to connect
    socket.on('new-player', function(state) {
        console.log('New player joined with state:', state);
        players[socket.id] = state;
        // Broadcast a signal to everyone containing the updated players list
        socket.broadcast.emit('update-players', players);
    });

    // Listen for a disconnection and update our player table
    socket.on('disconnect', function(state) {
        delete players[socket.id];
        io.emit('update-players', players);
    });

    // Listen for move events and tell all other clients that something has moved
    socket.on('move-player', function(position_data) {
        // console.log('POSSS', position_data)
        if (players[socket.id] == undefined) return; // Happens if the server restarts and a client is still connected
        players[socket.id].x = position_data.x;
        players[socket.id].y = position_data.y;
        players[socket.id].angle = position_data.angle;
        io.emit('update-players', players);
    });

    // Listen for shoot-bullet events and add it to our bullet array
    socket.on('shoot-bullet', function(data) {
        if (players[socket.id] == undefined) {
            console.log('hii')
            return;
        }
        let new_bullet = data;
        console.log('bullet', new_bullet)
        data.owner_id = socket.id; // Attach id of the player to the bullet
        if (Math.abs(data.speed_x) > 20 || Math.abs(data.speed_y) > 20) {
            console.log('Player', socket.id, 'is cheating!');
        }
        bullet_array.push(new_bullet);
    });
});

// Update the bullets 60 times per frame and send updates
function ServerGameLoop() {
 
    for (let i = 0; i < bullet_array.length; i++) {
        let bullet = bullet_array[i];
        bullet.x += bullet.speed_x;
        bullet.y += bullet.speed_y;
        // Check if this bullet is close enough to hit any player
        for (let id in players) {
            if (bullet.owner_id != id) {
                // And your own bullet shouldn't kill you
                let dx = players[id].x - bullet.x;
                let dy = players[id].y - bullet.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 70) {
                    health--
                    io.emit('player-hit', {id, health}); // Tell everyone this player got hit
                }
                // if (health < 0) {

                // }
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
    // Tell everyone where all the bullets are by sending the whole array
    io.emit('bullets-update', bullet_array);
}

setInterval(ServerGameLoop, 16);
