let ASSET_URL = 'assets/';

//We first initialize the phaser game object
let WINDOW_WIDTH = 750;
let WINDOW_HEIGHT = 500;
let game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, '', {preload:preload, create:create, update:GameLoop} );
let WORLD_SIZE = {w:750,h:500};
          
let water_tiles = [];
let bullet_array = [];
let other_players = {};
let done = false;
let healthText;
let socket; //Declare it in this scope, initialize in the `create` function
let sprite;
let player;
let zombie1;
let zombie2;
let zombie3;
let zombies;
let robots = [
  {robot1 : true, assets: 'robot1'},
  {robot2 : false, assets:'robot2'},
  {robot3 : false, assets:'robot3'},
  {robot4 : false, assets:'robot4'
  }
];
let currentRobot = 0;
           
function createSprite(x,y,angle, id){
  // type is an int that can be between 1 and 6 inclusive 
  // returns the sprite just created 
  game.physics.startSystem(Phaser.Physics.P2JS);
  // game.physics.p2.restitution = 0.8;
                
  sprite = game.add.sprite(x,y,robots[0].assets);       //changed  "ship" to "person"    +    '_1 to type
  sprite.fiction = 0.95;
             
  sprite.rotation = angle;
  sprite.anchor.setTo(0.5,0.5);
                
                
  // sprite.body.setZeroDamping();
  // sprite.body.fixedRotation = true;
  // console.log('SPRITE', sprite)
  return sprite;
}

function preload(){
  game.load.crossOrigin = 'Anonymous';
  game.stage.backgroundColor = '#58da45';                             //+++changed background color 
  // Load all the ships
  for(let i=1;i<=4;i++){                                                 
    game.load.image(`robot${i}`, `${ASSET_URL}robot${i}_gun.png`);           //+++changing assets 
  }
  game.load.image('zombie', ASSET_URL + 'zombie.png');
  game.load.image('bullet', ASSET_URL + 'blue_beam.png');
  game.load.image('water', ASSET_URL + 'tile_06.png');
  game.load.image('wall', ASSET_URL + 'tile_265.png');
}


function create(){

  game.physics.startSystem(Phaser.Physics.P2JS);
  game.physics.p2.restitution = 0.8;

  // Create tiles 
  for(let i=0;i<=WORLD_SIZE.w/64+1;i++){
    for(let j=0;j<=WORLD_SIZE.h/64+1;j++){
      let tile_sprite = game.add.sprite(i * 64, j * 64, 'water');
      tile_sprite.anchor.setTo(0.5,0.5);
      tile_sprite.alpha = 0.5;
      water_tiles.push(tile_sprite);
    }
  }

  //SCORE
  healthText = game.add.text(16, 16, `Health: ${player.health}`, {fontSize: '32px',
    fill: '#000' });

  //zombies
  let zombieCollisionGroup = game.physics.p2.createCollisionGroup();
  let playerCollisionGroup = game.physics.p2.createCollisionGroup();
  game.physics.p2.updateBoundsCollisionGroup();


  zombies = game.add.group();
  zombies.enableBody = true;
  zombies.physicsBodyType = Phaser.Physics.P2JS;
  for (let i = 0; i < 4; i++)
  {
    zombie = zombies.create(game.world.randomX, game.world.randomY, 'zombie');
    console.log(zombie.body);
    zombie.body.static = true;
    // zombie.body.velocity.y += 100;
    // zombie.body.velocity.x += -100
    // zombie.body.moveDown(100)
    // zombie.body.moveUp(200)
    // zombie.body.setCollisionGroup(zombieCollisionGroup)
    // zombie.body.collides([zombieCollisionGroup, playerCollisionGroup]);
  }

  // zombie1 = game.add.sprite(
  //     Math.random() * WORLD_SIZE.w/2 + WORLD_SIZE.w/2,
  //     Math.random() * WORLD_SIZE.h/2 + WORLD_SIZE.h/2,
  //     'zombie'
  // )
  // zombie2 = game.add.sprite(
  //     Math.random() * WORLD_SIZE.w/2 + WORLD_SIZE.w/2,
  //     Math.random() * WORLD_SIZE.h/2 + WORLD_SIZE.h/2,
  //     'zombie'
  // )
  // zombie3 = game.add.sprite(
  //     Math.random() * WORLD_SIZE.w/2 + WORLD_SIZE.w/2,
  //     Math.random() * WORLD_SIZE.h/2 + WORLD_SIZE.h/2,
  //     'zombie'
  // )

  // game.stage.disableVisibilityChange = true;
  // Create player
  
  player.sprite = game.add.sprite(
    Math.random() * WORLD_SIZE.w/2 + WORLD_SIZE.w/2,
    Math.random() * WORLD_SIZE.h/2 + WORLD_SIZE.h/2,
    robots[currentRobot].assets);
  // player.sprite.anchor.setTo(0.5,0.5);
               
  game.physics.p2.enable(player.sprite);
  player.sprite.body.setZeroDamping();
  player.sprite.body.fixedRotation = true;
  player.sprite.body.setZeroVelocity();

  game.world.setBounds(0, 0, WORLD_SIZE.w, WORLD_SIZE.h);
  game.physics.startSystem(Phaser.Physics.P2JS);
  // game.physics.p2.setImpactEvents(true)
  game.camera.follow = player.sprite;
            
  socket = io(); // This triggers the 'connection' event on the server
  socket.emit('new-player',{
    x:player.sprite.x,
    y:player.sprite.y,
    angle:player.sprite.rotation,
    type:1});
  // Listen for other players connecting
  socket.on('update-players',function(players_data){
    let players_found = {};
    // Loop over all the player data received
    for(let id in players_data){
      // If the player hasn't been created yet
      if(other_players[id] == undefined && id != socket.id){ // Make sure you don't create yourself
        let data = players_data[id];
        let p = createSprite(data.type,data.x,data.y,data.angle);
        other_players[id] = p;
        console.log('Created new player at (' + data.x + ', ' + data.y + ')');
      }
      players_found[id] = true;
                        
      // Update positions of other players 
      if(id != socket.id){
        other_players[id].target_x  = players_data[id].x; // Update target, not actual position, so we can interpolate
        other_players[id].target_y  = players_data[id].y;
        other_players[id].target_rotation  = players_data[id].angle;
      }
                        
                        
    }
    // Check if a player is missing and delete them 
    for(let id in other_players){
      if(!players_found[id]){
        other_players[id].destroy();
        delete other_players[id];
      }
    }
                   
  });
              
  // Listen for bullet update events 
  socket.on('bullets-update',function(server_bullet_array){
    // If there's not enough bullets on the client, create them
    for(let i=0;i<server_bullet_array.length;i++){
      if(bullet_array[i] == undefined && player.health > 0){
        bullet_array[i] = game.add.sprite(
          server_bullet_array[i].x,
          server_bullet_array[i].y,
          'bullet');
      } else {
        //Otherwise, just update it! 
        bullet_array[i].x = server_bullet_array[i].x; 
        bullet_array[i].y = server_bullet_array[i].y;
      }
    }
    // Otherwise if there's too many, delete the extra 
    for(let i=server_bullet_array.length;i<bullet_array.length;i++){
      bullet_array[i].destroy();
      bullet_array.splice(i,1);
      i--;
    }
                  
  });
              
  // Listen for any player hit events and make that player flash 
  socket.on('player-hit',function(state, id, health){
    let hitInfo = {};
    hitInfo = state;
    id = hitInfo.id;
    health = hitInfo.health;
                    
    if(id == socket.id){
      //If this is you
      player.sprite.alpha = 0;
      player.health = health;
      healthText.text = 'Health: ' + player.health;
      console.log('player.health', player.health);
                        
    } else {
      // console.log('id: ', id)
      // console.log('socket: ', socket.id)
      other_players[id].alpha = 0;
    }
    if (health < 0 && id == socket.id) {
      player.sprite.destroy();
      player.health = 100;
      console.log('player.health', player.health);
      console.log('player', player);
                        
    } else if (health < 0 && id != socket.id) {
      other_players[id].destroy();
    }
  });

  socket.on('score', function(score) {
    scoreText.text = 'Score: ' + score;
  });
}

function randomWholeNumber() {
  let number = Math.floor(Math.random() * 4);
  return number;
}
            

function GameLoop(){
  player.update();

  //changing players 
  if (game.input.keyboard.isDown(Phaser.Keyboard.C)) {
      if (currentRobot < 3) {
          currentRobot++;
        console.log('HEEELLLLLLOOOOO:', robots[currentRobot]);
      return player.sprite.loadTexture(robots[currentRobot].assets);
    } else {
        currentRobot = 0; 
        console.log('CURRENTROBOT', currentRobot);
    }
  }
  //Move zombies
  game.physics.p2.enable(zombies);

  // if (randomWholeNumber() === 1) {
  //     zombie1.body.moveDown(200)
  // } else if (randomWholeNumber === 0) {
  //     zombie1.body.moveRight(200)
  // }   else if (randomWholeNumber === 2) {
  //     zombie1.body.moveLeft(200)
  // } else if (randomWholeNumber === 3) {
  //     zombie1.body.moveUp(200)
  // }

  // Move camera with player 
  let camera_x = player.sprite.x - WINDOW_WIDTH/2;
  let camera_y = player.sprite.y - WINDOW_HEIGHT/2;
  game.camera.x += (camera_x - game.camera.x) * 0.08;
  game.camera.y += (camera_y - game.camera.y) * 0.08;
              
  // Each player is responsible for bringing their alpha back up on their own client 
  // Make sure other players flash back to alpha = 1 when they're hit 
  for(let id in other_players){
    if(other_players[id].alpha < 1){
      other_players[id].alpha += (1 - other_players[id].alpha) * 0.16;
    } else {
      other_players[id].alpha = 1;
    }
  }
  

   

  // Interpolate all players to where they should be 
  for(let id in other_players){
    let p = other_players[id];
    if(p.target_x != undefined){
      p.x += (p.target_x - p.x) * 0.16;
      p.y += (p.target_y - p.y) * 0.16;
      // Intepolate angle while avoiding the positive/negative issue 
      let angle = p.target_rotation;
      let dir = (angle - p.rotation) / (Math.PI * 2);
      dir -= Math.round(dir);
      dir = dir * Math.PI * 2;
      p.rotation += dir * 0.16;
    }
  }
}
          
            