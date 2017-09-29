console.log('heyo')

let ASSET_URL = "https://cdn.glitch.com/d371c629-b475-4d7b-88bc-b2558ae406a4%2F"

let WINDOW_WIDTH = 750;
let WINDOW_HEIGHT = 500;
let game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, '', {preload:preload, create:create, update:GameLoop})

let WORLD_SIZE = {w: 750, h: 500};

let water_tiles = [];
let bullet_array = [];

let player = {
    sprite: null,
    speed_x: 0,
    speed_y: 0,
    speed: 0.5,
    friction: 0.95,
    shot: false,
    update: function() {
        let dx = (game.input.mousePointer.x + game.camera.x) - this.sprite.x;
        let dy = (game.input.mousePointer.y + game.camera.y) - this.sprite.y;
        let angle = Math.atan2(dy, dx) - Math.PI/2;
        let dir = (angle - this.sprite.rotation) / (Math.PI * 2);
        dir -= Math.round(dir);
        dir = dir * Math.PI * 2;
        this.sprite.rotation += dir * 0.1;

        //Forward movement
        if (game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.speed_x += Math.cos(this.sprite.rotation + Math.PI/2) * this.speed;
            this.speed_y += Math.sin(this.sprite.rotation + Math.PI/2) * this.speed;
        }

        this.sprite.x += this.speed_x;
        this.sprite.y += this.speed_y;

        this.speed_x *= this.friction;
        this.speed_y *= this.friction;

        //Shoot bullet
        if (game.input.activePointer.leftButton.isDown && !this.shot) {
            let speed_x = Math.cos(this.sprite.rotation + Math.PI/2) * 20;
            let speed_y = Math.sin(this.sprite.rotation + Math.PI/2) * 20;
            let bullet = {};
            bullet.speed_x = speed_x;
            bullet.speed_y = speed_y;
            bullet.sprite = game.add.sprite(this.sprite.x + bullet.speed_x, this.sprite.y + bullet.speed_y, 'bullet')
            bullet_array.push(bullet);
            this.shot = true;
        }
        if (!game.input.activePointer.leftButton.isDown) this.shot = false;
        if(this.sprite.alpha < 1) {
            this.sprite.alpha += (1 - this.sprite.alpha) * 0.16;
        } else {
            this.sprite.alpha = 1;
        }
    }

}

function createShip(type, x, y, angle) {
    let sprite = game.add.sprite(x, y, 'ship' + String(type) + '_1')
    sprite.rotation = angle;
    sprite.anchor.setTo(0.5, 0.5);
    return sprite;
}

function preload() {
    game.load.crossOrigin = "Anonymous";
    game.stage.backgroundColor = "#3399DA";

    for (let i = 1; i <= 6; i++) {
        game.load.image('ship' + String(i) + '_1', ASSET_URL + 'ship' + String(i) + '_1.png')
        game.load.image('ship' + String(i) + '_2', ASSET_URL + 'ship' + String(i) + '_2.png')
        game.load.image('ship' + String(i) + '_3', ASSET_URL + 'ship' + String(i) + '_3.png')
        game.load.image('ship' + String(i) + '_4', ASSET_URL + 'ship' + String(i) + '_4.png')
    }

    game.load.image('bullet', ASSET_URL + 'cannon_ball.png');
    game.load.image('water', ASSET_URL + 'water_tile.png')
}

function create() {
    //create water tiles
    for (let i = 0; i <= WORLD_SIZE.w/64+1; i++) {
        for (let j = 0; j <= WORLD_SIZE.h/64 + 1; j++) {
            let tile_sprite = game.add.sprite(i * 64, j * 64, 'water')
            tile_sprite.anchor.setTo(0.5, 0.5);
            tile_sprite.alpha = 0.5;
            water_tiles.push(tile_sprite)
        }
    }

    //create player
    let player_ship_type = String(1);
    player.sprite = game.add.sprite(Math.random() * 
    WORLD_SIZE.w/2 + WORLD_SIZE.w/2, Math.random() * 
    WORLD_SIZE.h/2 + WORLD_SIZE.h/2,
    'ship' + player_ship_type + '_1')
    player.sprite.anchor.setTo(0.5, 0.5);
    game.world.setBounds(0, 0, WORLD_SIZE.w, WORLD_SIZE.h);

    //keeps player in the center?
    game.camera.x = player.sprite.x - WINDOW_WIDTH/2;
    game.camera.y = player.sprite.y - WINDOW_HEIGHT/2;
}

function GameLoop() {
    player.update();

    let camera_x = player.sprite.x - WINDOW_WIDTH/2;
    let camera_y = player.sprite.y - WINDOW_HEIGHT/2;
    game.camera.x += (camera_x - game.camera.x) * 0.08;
    game.camera.y += (camera_y - game.camera.y) * 0.08;

    //bullet updater
    for (let i = 0; i < bullet_array.length; i++) {
        let bullet = bullet_array[i];
        bullet.sprite.x += bullet.speed_x;
        bullet.sprite.y += bullet.speed_y;
        if (bullet.sprite.x < -10 || bullet.sprite.x > WORLD_SIZE.w 
            || bullet.sprite.y < -10 || bullet.sprite.y > WORLD_SIZE.h) {
                bullet.sprite.destroy();
                bullet_array.splice(i, 1)
                i--
            }
    }
}