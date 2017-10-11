
zombie = {
    sprite: null,
    speed_x: 0,
    speed_y: 0,
    speed: 0.5,
    friction: 0.5,
    friction: 0.95,
    create: function(player) {
        if (player = true) {

        
        let zombie1 = this.sprite;
        game.physics.p2.enable(zombie1);
        zombie1.body.setZeroDamping();
        zombie1.body.fixedRotation = true;
        zombie1.body.setZeroVelocity();
        if (true) {
            zombie1.x = 200
        }
        console.log(zombie1.x)
        socket.emit('move-zombie', { 
            x: zombie1.x, y: zombie1.y, angle: zombie1.rotation });
    }
}
}