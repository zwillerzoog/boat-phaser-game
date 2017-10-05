
//  game.physics.startSystem(Phaser.Physics.ARCADE);
let players = {};

//zombies
let zombie = {
    update: function() {
        let tween; 
        
        zombies = game.add.group();
        zombies.enableBody = true;
        game.physics.arcade.enable(zombies)
        // zombies.physicsBodyType = Phaser.Physics.ARCADE;
        for (let i = 0; i < 4; i++) {
            zombie1 = zombies.create(100, 250, 'zombie');
            zombie1.body.collideWorldBounds = true;  
            game.physics.arcade.collide(zombie, player.sprite);
            tween = game.add.tween(zombie1)
            switch (i) {
                case 0:
                    tween.to({ 
                        x: [500, 500, 100, 100], 
                        y: [250, 150, 150, 250] }, 
                        3000, "Linear");
                    break;
                case 1:
                    tween.to({ 
                        x: [100, 500, 200, 100], 
                        y: [150, 150, 150, 150] }, 
                        3000, "Linear");
                case 2:
                    tween.to({ 
                        x: [0, 500, 200, 0], 
                        y: [150, 150, 150, 150] }, 
                        3000, "Linear");
                case 3:
                    tween.to({ 
                        x: [400, 700, 300, 400], 
                        y: [250, 150, 150, 250] }, 
                        7000, "Linear");
            }
            
            tween.start();
            tween.loop()
            eatPlayer(players)
            // game.physics.arcade.overlap(zombie, player.sprite, eatPlayer, null, this)
            }
         
    }
}

function eatPlayer(players) {
    console.log('players', players);
    zombie.x += zombie.speed_x; 
    zombie.y += zombie.speed_y; 
 
    // Check if this zombie is close enough to hit any player 
    for(let id in players){
      if(socket.id = id){
          
        // And your own zombie shouldn't kill you
        let dx = players[id].x - zombie.x; 
        let dy = players[id].y - zombie.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if(dist < 70){
          players.kill()
          // io.emit('health', health)
          io.emit('player-hit', {id, health}); // T
}
      }
    }
}
