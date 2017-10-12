let ASSET_URL = 'assets/';

let WINDOW_WIDTH = 750;
let WINDOW_HEIGHT = 500;
let game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: GameLoop
});
let WORLD_SIZE = { w: 750, h: 500 };

let water_tiles = [];
let bullet_array = [];
let other_players = {};
let done = false;
let score;
let scoreText;
let socket;
let sprite;
let player;
let walls;
let wall1;
let wall2;
let pew;
let wallHitSound;
let wallCollisionGroup;
let laserCollisionGroup;
let playerCollisionGroup;
let laser;
let smoke;
let costume = 'person_1';

function createSprite(type, x, y, angle) {
    // type is an int that can be between 1 and 6 inclusive
    game.physics.startSystem(Phaser.Physics.P2JS);

    sprite = game.add.sprite(x, y, 'person' + String(type) + '_' + type);
    sprite.fiction = 0.95;

    sprite.rotation = angle;
    sprite.anchor.setTo(0.5, 0.5);

    return sprite;
}

function preload() {
    game.load.crossOrigin = 'Anonymous';
    game.stage.backgroundColor = '#58da45';
    for (let i = 1; i <= 10; i++) {
        game.load.image(
            'person_1',
            ASSET_URL + 'robot1_gun.png'
        );
        game.load.image(
            'person_2',
            ASSET_URL + 'robot2_gun.png'
        );
        game.load.image(
            'person_3',
            ASSET_URL + 'robot3_gun.png'
        );
        game.load.image(
            'person_4',
            ASSET_URL + 'robot4_gun.png'
        );
    }
    game.load.spritesheet('robot', ASSET_URL + 'robot_spritesheet.png', 49, 46)
    game.load.image('laser', ASSET_URL + 'red_beam.png');
    game.load.image('asphalt', ASSET_URL + 'asphalt.png');
    game.load.image('wall', ASSET_URL + 'wall.png');
    game.load.spritesheet('smoke', ASSET_URL + 'smoke-fire.png', 16, 16);
    game.load.audio('pew', ASSET_URL + 'heidi-pew.mp3');
    game.load.audio('wall-hit', ASSET_URL + 'wall-hit.mp3');
}

function create() {
    game.world.setBounds(0, 0, WORLD_SIZE.w, WORLD_SIZE.h);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);

    // Create tiles
    for (let i = 0; i <= WORLD_SIZE.w / 64 + 1; i++) {
        for (let j = 0; j <= WORLD_SIZE.h / 64 + 1; j++) {
            let tile_sprite = game.add.sprite(i * 64, j * 64, 'asphalt');
            tile_sprite.anchor.setTo(0.5, 0.5);
            tile_sprite.alpha = 0.5;
            water_tiles.push(tile_sprite);
        }
    }

    // SCORE
    scoreText = game.add.text(16, 16, 'score:0', {
        fontSize: '32px',
        fill: '#000'
    });

    // Walls
    walls = game.add.group();
    walls.enableBody = true;
    walls.physicsBodyType = Phaser.Physics.P2JS;
    wall1 = walls.create(200, WINDOW_HEIGHT / 2, 'wall');
    wall1.body.static = true;

    wall2 = game.add.sprite(550, WINDOW_HEIGHT / 2, 'wall');
    walls.add(wall2);
    wall2.body.rotation = 1.5708;
    wall2.body.static = true;

    // Sounds
    pew = game.add.audio('pew', 3);
    wallHitSound = game.add.audio('wall-hit');

    // Create collision Behavior
    wallCollisionGroup = game.physics.p2.createCollisionGroup();
    laserCollisionGroup = game.physics.p2.createCollisionGroup();
    playerCollisionGroup = game.physics.p2.createCollisionGroup();
    wall1.body.setCollisionGroup(wallCollisionGroup);
    wall2.body.setCollisionGroup(wallCollisionGroup);

    // Fire laser
    game.input.onUp.add(shootLaser, this);

    // game.stage.disableVisibilityChange = true;
    // Create player


    let player_robot_type = String(1);
    player.sprite = game.add.sprite(
        Math.random() * WORLD_SIZE.w / 2 + WORLD_SIZE.w / 2,
        Math.random() * WORLD_SIZE.h / 2 + WORLD_SIZE.h / 2,
        'robot'
    );

    player.sprite.frame = 0;
    // player.sprite.anchor.setTo(0.5,0.5);

    game.physics.p2.enable(player.sprite);
    player.sprite.body.setCollisionGroup(playerCollisionGroup);
    player.sprite.body.setZeroDamping();
    player.sprite.body.fixedRotation = true;
    player.sprite.body.setZeroVelocity();

    // allows for things to stay within world bounds
    game.physics.p2.updateBoundsCollisionGroup();

    game.camera.follow = player.sprite;
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
            if (other_players[id] == undefined && id !== socket.id) {
                // Make sure you don't create yourself
                let data = players_data[id];
                let p = createSprite(data.type, data.x, data.y, data.angle);
                other_players[id] = p;
                console.log(
                    'Created new player at (' + data.x + ', ' + data.y + ')'
                );
            }
            players_found[id] = true;

            // Update positions of other players
            if (id !== socket.id) {
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
        incrementScore();
        if (id === socket.id) {
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
}

function shootLaser() {
    pew.play();

    // robot facing east
    if (player.sprite.rotation === 4.71239) {
        createLaser(30, 10, 550, 0, 1.5708);
    }

    // robot facing south
    if (player.sprite.rotation === 0) {
        createLaser(-10, 30, 0, 550, 0);
    }

    // robot facing west
    if (player.sprite.rotation === 1.5708) {
        createLaser(-30, -10, -550, 0, 1.5708);
    }

    // robot facing north
    if (player.sprite.rotation === 3.14159) {
        createLaser(10, -30, 0, -550, 0);
    }

    laser.scale.setTo(0.6, 0.75);
    laser.body.setCollisionGroup(laserCollisionGroup);
    laser.body.collides([wallCollisionGroup, playerCollisionGroup]);
}

function createLaser(xOffset, yOffset, xVelocity, yVelocity, rotationRadians) {
    laser = game.add.sprite(
        player.sprite.position.x + xOffset,
        player.sprite.position.y + yOffset,
        'laser'
    );
    game.physics.p2.enable(laser);
    laser.body.collideWorldBounds = false;
    laser.body.velocity.x = xVelocity;
    laser.body.velocity.y = yVelocity;
    laser.body.rotation = rotationRadians;
}


function GameLoop() {
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

    //change costume
    if (game.input.keyboard.isDown(Phaser.Keyboard.C)) {
        console.log('hallo')
        for (let i = 1; i < 4; i++) {
            
            player.sprite.frame = i
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

    // Collision behavior
    wall1.body.collides(laserCollisionGroup, laserCollisionHandler, this);
    wall2.body.collides(laserCollisionGroup, laserCollisionHandler, this);
    wall1.body.collides(playerCollisionGroup);
    wall2.body.collides(playerCollisionGroup);
    player.sprite.body.collides(wallCollisionGroup);
}

function laserCollisionHandler(wallBody, laserBody) {
    wallHitSound.play();

    // robot facing east
    if (player.sprite.rotation === 4.71239) {
        createSmoke(laserBody, -2, -11);
    }

    // robot facing south
    if (player.sprite.rotation === 0) {
        createSmoke(laserBody, -11, 0);
    }

    // robot facing west
    if (player.sprite.rotation === 1.5708) {
        createSmoke(laserBody, -24, -13);
    }

    // robot facing north
    if (player.sprite.rotation === 3.14159) {
        createSmoke(laserBody, -13, -22);
    }

    animateSmoke();
    laserBody.sprite.kill();
}

function createSmoke(laserBody, xOffset, yOffset) {
    smoke = game.add.sprite(
        laserBody.sprite.position.x + xOffset,
        laserBody.sprite.position.y + yOffset,
        'smoke'
    );
}

function animateSmoke() {
    smoke.scale.setTo(1.5, 1.5);
    smoke.animations.add('smoke', [0, 1, 2, 3, 4, 5, 6, 7], 16, false);
    smoke.play('smoke', null, null, true);
}
