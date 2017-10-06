
//  game.physics.startSystem(Phaser.Physics.ARCADE);
let players = {};
let zombieArray = [];
let tween = [];
let i = 3


//zombies
let zombie = {
    update: function() {
        let xArray = [];
        let yArray = []
        let playerCollisionGroup = game.physics.p2.createCollisionGroup();
        let zombieCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();
        game.physics.p2.restitution = 0;
        zombies = game.add.group();
        zombies.enableBody = true;
        // zombies.body.kinematic = true;
        zombies.physicsBodyType = Phaser.Physics.P2JS;
        
        // for (let i = 0; i < 4; i++) {
            zombie0 = zombies.create(100, 100, 'zombie');
            zombie0.body.kinematic = true;
            tween0 = game.add.tween(zombie0.body)
            xArray = [500, 500, 100, 100]
            yArray = [250, 150, 150, 100]
            tween0.to({ 
                        x: xArray, 
                        y: yArray}, 
                        10000, "Linear");
            
            tween0.start();
            tween0.loop()
            // zombie0.body.setCollisionGroup(zombieCollisionGroup)
            // zombie0.body.collideWorldBounds = true; 

            zombie1 = zombies.create(100, 370, 'zombie');
            zombie1.body.kinematic = true;
            tween1 = game.add.tween(zombie1.body)
            xArray= [500, 100];
            yArray=[370, 370];
            tween1.to({ 
                        x: xArray, 
                        y: yArray }, 
                        10000, "Linear");
            
            tween1.start();
            tween1.loop()

            zombie2 = zombies.create(700, 100, 'zombie');
            zombie2.body.kinematic = true;
            tween2 = game.add.tween(zombie2.body)
            xArray = [700, 650, 650, 700]
            yArray = [370, 100, 370, 100]
            tween2.to({ 
                        x: xArray, 
                        y:  yArray}, 
                        10000, "Linear");
            
            tween2.start();
            tween2.loop()
            // zombie0.body.collides(playerCollisionGroup, eatPlayer, this)
                console.log(zombie0.body.x)

            io.emit('zombie-movements', {
                zombie0: {
                    x: zombie0.body.x,
                    y: zombie0.body.y        
                },
                zombie1: {
                    x: zombie0.body.x,
                    y: zombie0.body.y        
                },
                zombie2: {
                    x: zombie0.body.x,
                    y: zombie0.body.y        
                }
            })
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
