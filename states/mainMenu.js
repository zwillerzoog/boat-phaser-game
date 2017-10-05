Game.MainMenu = function(game) {
};

Game.MainMenu.prototype = {
  init:function(game){
    this.buttonArr = [];
    this.buttonIndex = 0;
    this.arrow = null;
    this.music = null;
  },
  create:function(game) {
    //////CENTERS PHASER GAME WINDOW/////////
    this.game.scale.pageAlignHorizontally = true;
    this.game.scale.pageAlignVertically = true;
    this.game.scale.refresh();
        
    //Background
    game.add.sprite(0,0,'bg2');

    //Title
    createText(game, 'Wasteland', 200, 50, '155px murderFont', '#FFF');

    //Instructions on how to use menu screen
    createText(game, 'Up Or Down key to move between buttons', 285, game.world.height - 115, '22px murderFont', '#FFF');
    createText(game, 'Enter key to Select', 360, game.world.height - 65, '22px murderFont', '#FFF');
        
    //Adding all the buttonImages
    this.buttonArr.push(createImageButton(game, 'Play Game', 425, 260, 90, 90));
        
    let button = createImageButton(game, 'Instructions', 425, 335, 90, 90);
    button.tweenAnimation.pause();
    this.buttonArr.push(button);
        
    button = createImageButton(game, 'High Scores', 425, 410, 90, 90);
    button.tweenAnimation.pause();
    this.buttonArr.push(button);

    //Adding the arrow sprite
    this.arrow = game.add.sprite(275, 260, 'piglet');
    this.arrow.anchor.setTo(0.5, 0.5);
    this.arrow.canMove = true;
    this.arrow.animations.add('right', [2,3], 5, true);

    createRain(game, 300, 500, -5, 5, 0.1, 0.5, 0, 0, 30);

    //Plays the music only when we start the menu screen initially or after gameover/ victory screen
    if(game.global.menuMusic) {
      window.music = game.add.audio('menu_music');
      window.music.play('', 0, 1, true, true);
      game.global.menuMusic = false;
    }
  },
  update: function(game) {
    //resets the buttonImage scale to default
    this.buttonArr[this.buttonIndex].scale.x = 0.5;
    this.buttonArr[this.buttonIndex].scale.y = 0.5;
    this.arrow.animations.play('right');

    //Moves piglet down and starts up the buttonImage the piglet is on
    if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN) && this.buttonIndex < 2 && this.arrow.canMove) {
      this.buttonArr[this.buttonIndex].tweenAnimation.pause();
      this.buttonIndex++;
      this.arrow.position.y += 75;

      this.buttonArr[this.buttonIndex].tweenAnimation = game.add.tween(this.buttonArr[this.buttonIndex].scale)
        .to({x: 0.7, y: 0.7},500,'Linear',true,0,-1,true);
            
      this.tempStopArrow(game);
    }

    //Moves piglet up and starts up the buttonImage the piglet is on
    if(game.input.keyboard.isDown(Phaser.Keyboard.UP) && this.buttonIndex > 0 && this.arrow.canMove) {
      this.buttonArr[this.buttonIndex].tweenAnimation.pause();
      this.buttonIndex--;
      this.arrow.position.y -= 75;

      this.buttonArr[this.buttonIndex].tweenAnimation = game.add.tween(this.buttonArr[this.buttonIndex].scale)
        .to({x: 0.7, y: 0.7},500,'Linear',true,0,-1,true);
      this.tempStopArrow(game);
    }
        
    //Selects the buttonImage
    if(game.input.keyboard.isDown(Phaser.Keyboard.ENTER)){
      if(this.buttonIndex === 0){
        game.state.start('Level1');
        window.music.stop();
        window.music.destroy();
      }else if(this.buttonIndex === 1){
        game.state.start('InfoModal');
      }else{
        game.state.start('HighScores');
      }
    }
  },
  //delays the arrow so that you won't go down all the way
  tempStopArrow: function(game) {
    this.arrow.canMove = false;
    createTimer(game, ()=>{
      this.arrow.canMove = true;
    }, 200);
  }
};