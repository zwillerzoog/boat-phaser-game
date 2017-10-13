var Instructions = function(game) {};

Instructions.prototype = {

  menuConfig: {
    className: 'default',
    startY: 400,
    startX: 'center'
  },


  init: function () {
    this.titleText = game.make.text(game.world.centerX, 100, 'Savage Ghosting', {
      font: 'bold 60pt TheMinion',
      fill: '#FDFFB5',
      align: 'center'
    });
    this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
    this.titleText.anchor.set(0.5);
    this.optionCount = 1;
  },

  createText: function(game, str, x, y, font, fill, align = 'center', anchorX = 0, anchorY = 0) {
    let txt = game.add.text(x, y, str, {
      font: font,
      fill: fill,
      align: align
    });
    txt.anchor.setTo(anchorX, anchorY);
    return txt;
  },

  create: function () {

    game.add.sprite(0, 0, 'instructions2').alpha = 0.3;
    game.add.existing(this.titleText);

    
    //Instruction Text
    let howToPlay = '1. Go to options';
    this.createText(game, howToPlay, 50, 160, '30px bold murderFont', 'white', 'center');
        
    howToPlay = '2. Play with music or play like a savage';
    this.createText(game, howToPlay, 50, 200, '30px bold murderFont', 'white', 'center');

    howToPlay = '3. Go Back to the main Menu';
    this.createText(game, howToPlay, 50, 240, '30px bold murderFont', 'white', 'center');

    howToPlay = '4. Press Start';
    this.createText(game, howToPlay, 50, 280, '30px bold murderFont', 'white', 'center');

    howToPlay = '5. Be a Savage';
    this.createText(game, howToPlay, 50, 320, '30px bold murderFont', 'white', 'center');

    howToPlay = '6. Pay Homage in the Credits';
    this.createText(game, howToPlay, 50, 360, '30px bold murderFont', 'white', 'center');
    
    
    this.addMenuOption('<- Back', function () {
      game.state.start('GameMenu');
    });
  }
};

Phaser.Utils.mixinPrototype(Instructions.prototype, mixins);
