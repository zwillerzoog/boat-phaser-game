
console.log('hi', game)

player = {
    sprite:null,//Will hold the sprite when it's created 
    speed_x:0,// This is the speed it's currently moving at
    speed_y:0,
    speed:0.5, // This is the parameter for how fast it should move 
    friction:0.95,
    shot:false,
    update: function(){
        // Move forward
        if(game.input.keyboard.isDown(Phaser.Keyboard.UP) || game.input.keyboard.isDown(Phaser.Keyboard.W)){  
            console.log(this.sprite)
            this.sprite.x += 10;
        }

        //turn right
        if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || game.input.keyboard.isDown(Phaser.Keyboard.D)){
            console.log('Rotation: ', this.speed)
            // this.speed_x += 10
            this.sprite.y += 10
        }

        //turn left
        if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || game.input.keyboard.isDown(Phaser.Keyboard.A)){
            // this.speed_x += -10
            this.sprite.y += -10
        }

        //move backward
        if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN) || game.input.keyboard.isDown(Phaser.Keyboard.S)){
            this.sprite.x += -10 
            // this.speed_y += -10 
        }
        
        // this.sprite.x += this.speed_x;
        // this.sprite.y = this.speed_y;
        // this.speed_x *= this.friction;
        // this.speed_y *= this.friction;
       
        // Shoot bullet 
        if(game.input.activePointer.leftButton.isDown && !this.shot){
            let speed_x = Math.cos(this.sprite.rotation + Math.PI/2) * 20;
            let speed_y = Math.sin(this.sprite.rotation + Math.PI/2) * 20;
            /* The server is now simulating the bullets, clients are just rendering bullet locations, so no need to do this anymore
            var bullet = {};
            bullet.speed_x = speed_x;
            bullet.speed_y = speed_y;
            bullet.sprite = game.add.sprite(this.sprite.x + bullet.speed_x,this.sprite.y + bullet.speed_y,'bullet');
            bullet_array.push(bullet); 
            */
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
        socket.emit('move-player',{x:this.sprite.x,y:this.sprite.y,angle:this.sprite.rotation})

    }
        
      
};