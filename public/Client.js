Client = {
    socket: io(),
    zombieManager: false,
    newPlayer: function(){
        this.socket.emit('newplayer');
    },
    playerMove: function(x, y){
        this.socket.emit('move', {x, y});
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
        this.socket.on('newplayer', function(player){
            console.log('add', player);
        });
        this.socket.on('allplayers', function(players){
            console.log('create game players with', players);
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
Client.initListeners();
Client.newPlayer();
//Client.playerMove(100, 200);
//Client.shootBeam(100, 200, 90, {x: 10, y: 10});