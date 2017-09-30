
// function () {

// }

player = {
    sprite:null,//Will hold the sprite when it's created 
    speed_x:0,// This is the speed it's currently moving at
    speed_y:0,
    speed:0.5, // This is the parameter for how fast it should move 
    friction:0.95,
    shot:false,
    update: function(){
        let dx = (game.camera.x) - this.sprite.x;
        let dy = (game.camera.y) - this.sprite.y;
        let angle = Math.atan2(dy, dx) - Math.PI / 2;
        let dir = (angle - this.sprite.rotation) / (Math.PI * 2);
        dir -= Math.round(dir);
        dir = dir * Math.PI * 2;
        this.sprite.rotation += dir * 0.1;
        // console.log(this.sprite)
       let me = this.sprite
            me.smoothed = false;
            // console.log(me.body)
            // //  Create our physics body. A circle assigned the playerCollisionGroup
            game.physics.p2.enable(me);
        	me.body.setZeroDamping();
            me.body.fixedRotation = true;
            me.body.setZeroVelocity();
            // sprite.body.setCircle(28);
            // //  This boolean controls if the player should collide with the world bounds or not
            // sprite.body.collideWorldBounds = true;
        
            // cursors = game.input.keyboard.createCursorKeys();
        // console.log('XXX: ', me.x);
        // console.log('YYYY', me.y)
        // console.log('ROTATION', me.rotation)
        // Move forward
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)){  
            // console.log(game.camera.x - this.sprite.x)
            me.body.moveUp(200)
            // if (this.sprite.y === 50 || this.sprite.y === 475) {
            //     return;
            // }
            this.sprite.rotation = 5
            // this.sprite.y += -10;
        }

        //turn right
         if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D)){
            me.rotation = -6
            me.body.moveRight(200)
        }

        //turn left
         if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A)){
            this.sprite.rotation = 3;
            me.body.moveLeft(200);
        }

        //move backward
        if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)){
            me.body.moveDown(200); 
        } 
       
        // Shoot bullet 
        if(game.input.activePointer.leftButton.isDown && !this.shot){
            let speed_x = Math.cos(this.sprite.rotation + Math.PI/2) * 20;
            let speed_y = Math.sin(this.sprite.rotation + Math.PI/2) * 20;
            this.shot = true;
            // Tell the server we shot a bullet 
            socket.emit('shoot-bullet',{x:this.sprite.x,y:this.sprite.y,angle:this.sprite.rotation,speed_x:speed_x,speed_y:speed_y})
        }
        if(!game.input.activePointer.leftButton.isDown) this.shot = false;
        // To make player flash when they are hit, set player.spite.alpha = 0
        if(this.sprite.alpha < 1){
            this.sprite.alpha += (1 - this.sprite.alpha) * 0.16;
        } else {
            this.sprite.alpha = 1;
        }
      
        // Tell the server we've moved 
        socket.emit('move-player',{x: me.x, y: me.y, angle: me.rotation})

    }
        
      
};