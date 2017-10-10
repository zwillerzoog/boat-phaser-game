// let sprite;
const Client = {
    socket: io(),
    zombieManager: false,
    newPlayer: function(x,y,angle){
        this.socket.emit('new-player', {
            x: player.sprite.x,
            y: player.sprite.y,
            angle: player.sprite.rotation
        });
    },
    movePlayer: function(x, y, angle){
        this.socket.emit('move-player', {
            x: player.sprite.x,
            y: player.sprite.y,
            angle: player.sprite.rotation
        });
    },
    shootBeam: function(x, y, angle, velocity){
        this.socket.emit('shot', {x, y, angle, velocity});
    },
    hitBeam: function(bulletID){
        this.socket.emit('hitshot', bulletID);
    },
    moveZombie: function(id, x, y){
        if(this.zombieManager){
            this.socket.emit('moveZombie', {id, x, y});
        }
    },
    initListeners: function(){
        // this.socket.on('newplayer', function(player){
        //     console.log('add', player);
        // });
        
        this.socket.on('update-players', function(players_data) {
            // console.log('players_data', players_data);
            let players_found = {};
            // Loop over all the player data received
            for (let id in players_data) {
              // If the player hasn't been created yet
              if (other_players[id] == undefined && id != socket.id) {
                // Make sure you don't create yourself
                let data = players_data[id];
                let p = createSprite(data.type, data.x, data.y, data.angle);
                other_players[id] = p;
                console.log('Created new player at (' + data.x + ', ' + data.y + ')');
              }
              players_found[id] = true;
        
              // Update positions of other players
              if (id != socket.id) {
                other_players[id].target_x = players_data[id].x; // Update target, not actual position, so we can interpolate
                other_players[id].target_y = players_data[id].y;
                other_players[id].target_rotation = players_data[id].angle;
              }
            }
            // Check if a player is missing and delete them
            for (let id in other_players) {
              if (!players_found[id]) {
                other_players[id].destroy();
                delete other_players[id];
              }
            }
        });

        this.socket.on('player-hit', function(player_data) {
            console.log(player_data);
            let id = player_data.id;
            health = player_data.health;
            if (id == socket.id) {
              //If this is you
              player.sprite.alpha = 0;
              healthText.text = 'health: ' + health;
            } else {
              setTimeout((done = true), 3000);
              other_players[id].alpha = 0;
            }
            if (health < 0 && id == socket.id) {
              player.sprite.destroy();
              player.health = 100;
              console.log('player.health', player.health);
              console.log('player', player);
              //take out the bullets
              for (let i = server_bullet_array.length; i < bullet_array.length; i++) {
                bullet_array[i].destroy();
                // bullet_array.splice(i,1);
                i--;
              }
            } else if (health < 0 && id != socket.id) {
              other_players[id].destroy();
            }
          });
        
        this.socket.on('allbullets', function(bullets){
            console.log('create game bullets with', bullets);
        });
        this.socket.on('allzombies', function(zombies){
            console.log('create game zombies with', zombies);
        });
        this.socket.on('zombiemanager', () => {
            this.zombieManager = true;
            console.log('This socket will be the zombie manager');
        })
        this.socket.on('move', function(coords){
            console.log('tween to', coords);
        });
        this.socket.on('zombiesUpdate', function(zombies){
            console.log('zombies update positions', zombies);
        });
        this.socket.on('newbullet', function(bullet){
            console.log('create new bullet', bullet)
        });
        this.socket.on('destroybullet', function(bulletID){
            console.log('destroy bullet', bulletID);
        })
        this.socket.on('remove', function(id){
            console.log('remove', id);
        });
    }
};
// Client.initListeners();
// Client.newPlayer();
//Client.playerMove(100, 200);
//Client.shootBeam(100, 200, 90, {x: 10, y: 10});