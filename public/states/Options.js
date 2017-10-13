'use strict';
var Options = function(game) {};

Options.prototype = {

  menuConfig: {
    className: 'default',
    startY: 150,
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
  create: function () {
    let playSound = gameOptions.playSound;
    let playMusic = gameOptions.playMusic;

    game.add.sprite(0, 0, 'options-bg');
    game.add.existing(this.titleText);
    this.addMenuOption(playMusic ? 'Mute Music' : 'Play Music', function (target) {
      playMusic = !playMusic;
      target.text = playMusic ? 'Mute Music' : 'Play Music';
      musicPlayer.volume = playMusic ? 1 : 0;
      console.log('MUSIC :', musicPlayer);
      console.log('VOLUME :', musicPlayer.volume);
    });
    // this.addMenuOption(playSound ? 'Mute Sound' : 'Play Sound', function (target) {
    //   playSound = !playSound;
    //   target.text = playSound ? 'Mute Sound' : 'Play Sound';
    //   // pew.volume = playSound ? 1 : 0; 
    // });
    this.addMenuOption('<- Back', function () {
      game.state.start('GameMenu');
    });
  }
};

Phaser.Utils.mixinPrototype(Options.prototype, mixins);