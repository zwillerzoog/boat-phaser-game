'use strict';
var Splash = function () {};

Splash.prototype = {

  loadScripts: function () {
    game.load.script('style', 'lib/style.js');
    game.load.script('mixins', 'lib/mixins.js');
    game.load.script('WebFont', 'vendor/webfontloader.js');
    game.load.script('gamemenu','states/GameMenu.js');
    game.load.script('game', 'states/Game.js');
    game.load.script('gameover','states/GameOver.js');
    game.load.script('credits', 'states/Credits.js');
    game.load.script('options', 'states/Options.js');
  },

  loadBgm: function () {
    game.load.audio('pew', 'assets/heidi-pew.mp3');
    game.load.audio('wall-hit',  'assets/wall-hit.mp3');
    game.load.audio('gamemusic', 'assets/8bit.mp3');    //--- ready for when we add game music
  },
  // varios freebies found from google image search
  loadImages: function () {
    game.load.image('mainmenu-bg', 'assets/images/mainmenu-bg.png');
    game.load.image('options-bg', 'assets/images/options-bg.jpg');
    game.load.image('gameover-bg', 'assets/images/gameover-bg.png');
    game.load.image('instructions1', 'assets/images/instructions1.jpeg');
    game.load.image('instructions2', 'assets/images/instructions2.jpg');
    game.load.image('instructions3', 'assets/images/instructions3.jpg');
  },

  loadFonts: function () {
    // WebFontConfig = {
    //   custom: {
    //     families: ['TheMinion'],
    //     urls: ['assets/style/theminion.css']
    //   }
    // }
  },

  init: function () {
    this.loadingBar = game.make.sprite(game.world.centerX-(387/2), 400, 'loading');
    this.logo       = game.make.sprite(100, 100, 'logo');
    this.status     = game.make.text(game.world.centerX, 380, 'Loading...', {fill: 'black'});
    utils.centerGameObjects([this.logo, this.status]);
  },

  preload: function () {
    game.add.sprite(0, 0, 'load-bg');
    game.add.existing(this.logo).scale.setTo(0.5);
    game.add.existing(this.loadingBar);
    game.add.existing(this.status);
    this.load.setPreloadSprite(this.loadingBar);

    this.loadScripts();
    this.loadImages();
    this.loadFonts();
    this.loadBgm();

  },

  addGameStates: function () {

    game.state.add('GameMenu',GameMenu);
    game.state.add('Game',Game);
    game.state.add('GameOver',GameOver);
    game.state.add('Credits',Credits);
    game.state.add('Options',Options);
  },

  addGameMusic: function () {
    this.musicPlayer = game.add.audio('gamemusic');
    this.musicPlayer.loop = true;
    this.musicPlayer.play();
  },

  create: function() {
    this.status.setText('Shootin\' Time!!!');
    this.addGameStates();
    this.addGameMusic();

    setTimeout(function () {
      game.state.start('GameMenu');
    }, 1500);
  }
};