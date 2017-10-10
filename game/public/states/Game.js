'use strict';
var Game = function(game) {

  //move globals and add this. when calling 
};

let ASSET_URL = 'assets/';

//We first initialize the phaser game object

// {
//   preload: preload,
//   create: create,
//   update: update
// });

let WORLD_SIZE = { w: 750, h: 500 };
let water_tiles = [];
let bullet_array = [];
let other_players = {};
let done = false;
let score;
let scoreText;
let socket; //Declare it in this scope, initialize in the `create` function
let sprite;
// let player;
let walls;
let wall1;
let wall2;


Game.prototype = {
  // addMenuOption: function(text, callback) {
  //   var optionStyle = { font: '30pt TheMinion', fill: 'white', align: 'left', stroke: 'rgba(0,0,0,0)', srokeThickness: 4};
  //   var txt = game.add.text(game.world.centerX, (this.optionCount * 80) + 200, text, optionStyle);
  //   txt.anchor.setTo(0.5);
  //   txt.stroke = 'rgba(0,0,0,0';
  //   txt.strokeThickness = 4;
  //   var onOver = function (target) {
  //     target.fill = '#FEFFD5';
  //     target.stroke = 'rgba(200,200,200,0.5)';
  //     txt.useHandCursor = true;
  //   };
  //   var onOut = function (target) {
  //     target.fill = 'white';
  //     target.stroke = 'rgba(0,0,0,0)';
  //     txt.useHandCursor = false;
  //   };
  //   //txt.useHandCursor = true;
  //   txt.inputEnabled = true;
  //   txt.events.onInputUp.add(callback, this);
  //   txt.events.onInputOver.add(onOver, this);
  //   txt.events.onInputOut.add(onOut, this);

  //   this.optionCount ++;


  // },

  createSprite: function (type, x, y, angle) {
    // type is an int that can be between 1 and 6 inclusive
    // returns the sprite just created
    game.physics.startSystem(Phaser.Physics.P2JS);
    // game.physics.p2.restitution = 0.8;

    sprite = game.add.sprite(x, y, 'person' + String(type) + '_' + type); //changed  "ship" to "person"    +    '_1 to type
    sprite.fiction = 0.95;

    sprite.rotation = angle;
    sprite.anchor.setTo(0.5, 0.5);

    // sprite.body.setZeroDamping();
    // sprite.body.fixedRotation = true;
    // console.log('SPRITE', sprite)
    return sprite;
  },

  preload: function () {
    this.optionCount = 1;
    game.load.crossOrigin = 'Anonymous';
    game.stage.backgroundColor = '#58da45'; //+++changed background color
    // Load all the ships
    for (let i = 1; i <= 10; i++) {
      game.load.image(
        'person' + String(i) + '_' + i,
        ASSET_URL + 'robot1_gun.png'
      ); //+++changing assets
      game.load.image(
        'person' + String(i) + '_2',
        ASSET_URL + 'robot2_gun.png'
      );
      game.load.image(
        'person' + String(i) + '_3',
        ASSET_URL + 'robot3_gun.png'
      );
      game.load.image(
        'person' + String(i) + '_4',
        ASSET_URL + 'robot4_gun.png'
      );
    }

    game.load.image('bullet', ASSET_URL + 'blue_beam.png');
    game.load.image('water', ASSET_URL + 'tile_06.png');
    game.load.image('wall', ASSET_URL + 'trak2_trim2b.png');
  },

  
  create: function () {
    game.physics.startSystem(Phaser.Physics.P2JS);
    // game.physics.p2.restitution = 0.8;

    // Create tiles
    for (let i = 0; i <= WORLD_SIZE.w / 64 + 1; i++) {
      for (let j = 0; j <= WORLD_SIZE.h / 64 + 1; j++) {
        let tile_sprite = game.add.sprite(i * 64, j * 64, 'water');
        tile_sprite.anchor.setTo(0.5, 0.5);
        tile_sprite.alpha = 0.5;
        water_tiles.push(tile_sprite);
      }
    }

    //SCORE
    scoreText = game.add.text(16, 16, 'score:0', {
      fontSize: '32px',
      fill: '#000'
    });

    // Walls
    let walls = game.add.group();
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.P2JS;
    wall1 = walls.create(200, WINDOW_HEIGHT / 2, 'wall');
    wall1.body.static = true;

    wall2 = game.add.sprite(550, WINDOW_HEIGHT / 2, 'wall');
    walls.add(wall2);
    wall2.body.rotation = 1.5708;
    wall2.body.static = true;

    // game.stage.disableVisibilityChange = true;
    // Create player
    let player_robot_type = String(1);
    player.sprite = game.add.sprite(
      Math.random() * WORLD_SIZE.w / 2 + WORLD_SIZE.w / 2,
      Math.random() * WORLD_SIZE.h / 2 + WORLD_SIZE.h / 2,
      'person' + player_robot_type + '_1'
    );

    console.log('WHAT HAPPENS', player.sprite);
    // player.sprite.anchor.setTo(0.5,0.5);

    game.physics.p2.enable(player.sprite);
    player.sprite.body.setZeroDamping();
    player.sprite.body.fixedRotation = true;
    player.sprite.body.setZeroVelocity();

    game.world.setBounds(0, 0, WORLD_SIZE.w, WORLD_SIZE.h);
    game.physics.startSystem(Phaser.Physics.P2JS);
    // game.physics.p2.setImpactEvents(true)
    game.camera.follow = player.sprite;
    // game.camera.y = player.sprite.y
    // game.camera.target = player.sprite;
    // console.log('CAMERA: ', game.camera.target)
    socket = io(); // This triggers the 'connection' event on the server
    socket.emit('new-player', {
      x: player.sprite.x,
      y: player.sprite.y,
      angle: player.sprite.rotation,
      type: 1
    });
    // Listen for other players connecting
    socket.on('update-players', function(players_data) {
      let players_found = {};
      // Loop over all the player data received
      for (let id in players_data) {
        // If the player hasn't been created yet
        if (other_players[id] == undefined && id != socket.id) {
          // Make sure you don't create yourself
          let data = players_data[id];
          let p = Game.prototype.createSprite(data.type, data.x, data.y, data.angle);
          other_players[id] = p;
          console.log(
            'Created new player at (' + data.x + ', ' + data.y + ')'
          );
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

    // Listen for bullet update events
    socket.on('bullets-update', function(server_bullet_array) {
      // If there's not enough bullets on the client, create them
      for (let i = 0; i < server_bullet_array.length; i++) {
        if (bullet_array[i] == undefined) {
          bullet_array[i] = game.add.sprite(
            server_bullet_array[i].x,
            server_bullet_array[i].y,
            'bullet'
          );
        } else {
          //Otherwise, just update it!
          bullet_array[i].x = server_bullet_array[i].x;
          bullet_array[i].y = server_bullet_array[i].y;
        }
      }
      // Otherwise if there's too many, delete the extra
      for (let i = server_bullet_array.length; i < bullet_array.length; i++) {
        bullet_array[i].destroy();
        bullet_array.splice(i, 1);
        i--;
      }
    });

    // Listen for any player hit events and make that player flash
    socket.on('player-hit', function(id) {
      this.incrementScore();
      if (id == socket.id) {
        //If this is you
        player.sprite.alpha = 0;
      } else {
        setTimeout((done = true), 3000);
        other_players[id].alpha = 0;
        // done = true;
      }
    });

    socket.on('score', function(score) {
      scoreText.text = 'Score: ' + score;
    });
  },

  update: function() {
    player.update();
    // Move camera with player
    let camera_x = player.sprite.x - WINDOW_WIDTH / 2;
    let camera_y = player.sprite.y - WINDOW_HEIGHT / 2;
    game.camera.x += (camera_x - game.camera.x) * 0.08;
    game.camera.y += (camera_y - game.camera.y) * 0.08;

    // Each player is responsible for bringing their alpha back up on their own client
    // Make sure other players flash back to alpha = 1 when they're hit
    for (let id in other_players) {
      if (other_players[id].alpha < 1) {
        other_players[id].alpha += (1 - other_players[id].alpha) * 0.16;
      } else {
        other_players[id].alpha = 1;
      }
    }

    // Interpolate all players to where they should be
    for (let id in other_players) {
      let p = other_players[id];
      if (p.target_x != undefined) {
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
  },

  // function doneTruer() {
  //     done = true
  // }
  incrementScore: function() {
    if (done) {
    // scoreText.text = 'Score: ' + score;
    }
    this.stage.disableVisibilityChange = false;
    game.add.sprite(0, 0, 'stars');
    this.addMenuOption('Next ->', function (e) {
      this.game.state.start('GameOver');
    });
  }
  
};