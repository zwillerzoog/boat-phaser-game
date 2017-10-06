
//  game.physics.startSystem(Phaser.Physics.ARCADE);
let players = {};
let zombieArray = [];
let tween = [];
let i = 3

//zombies
let zombie = {
    update: function() {
        let playerCollisionGroup = game.physics.p2.createCollisionGroup();
        let zombieCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();
        game.physics.p2.restitution = 0;
        zombies = game.add.group();
        zombies.enableBody = true;
        // zombies.body.kinematic = true;
        zombies.physicsBodyType = Phaser.Physics.P2JS;
        
        // for (let i = 0; i < 4; i++) {
            zombieArray[0] = zombies.create(100, 100, 'zombie');
            zombieArray[0].body.kinematic = true;
            tween0 = game.add.tween(zombieArray[0].body)
            tween0.to({ 
                        x: [500, 500, 100, 100], 
                        y: [250, 150, 150, 100] }, 
                        10000, "Linear");
            
            tween0.start();
            tween0.loop()
            // zombieArray[0].body.setCollisionGroup(zombieCollisionGroup)
            // zombieArray[0].body.collideWorldBounds = true; 

            zombieArray[1] = zombies.create(100, 370, 'zombie');
            zombieArray[1].body.kinematic = true;
            tween1 = game.add.tween(zombieArray[1].body)
            tween1.to({ 
                        x: [500, 100], 
                        y: [370, 370] }, 
                        10000, "Linear");
            
            tween1.start();
            tween1.loop()

            zombieArray[2] = zombies.create(700, 100, 'zombie');
            zombieArray[2].body.kinematic = true;
            tween2 = game.add.tween(zombieArray[2].body)
            tween2.to({ 
                        x: [700, 650, 650, 700], 
                        y: [370, 100, 370, 100] }, 
                        10000, "Linear");
            
            tween2.start();
            tween2.loop()
            // zombieArray[0].body.collides(playerCollisionGroup, eatPlayer, this)
            }
         
    }

    function makeZombie(i) {
        zombieArray[i] = zombies.create(700, 100, 'zombie');
        zombieArray[i].body.kinematic = true;
        console.log('zombieArray[i]', zombieArray[i]);
        tween[i] = game.add.tween(zombieArray[i].body)
        i++
    }

function eatPlayer(players) {
    console.log('players', players);
    // zombie.x += zombie.speed_x; 
    // zombie.y += zombie.speed_y; 
 
    // Check if this zombie is close enough to hit any player 
//     for(let id in players){
//       if(socket.id = id){
          
//         // And your own zombie shouldn't kill you
//         let dx = players[id].x - zombie.x; 
//         let dy = players[id].y - zombie.y;
//         let dist = Math.sqrt(dx * dx + dy * dy);
//         if(dist < 70){
//           players.kill()
//           // io.emit('health', health)
//           io.emit('player-hit', {id, health}); // T
// }
//       }
//     }
}
