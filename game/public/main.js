'use strict';
// let game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'), Main = function () {};
let Main = function () {};

Main.prototype = {

  preload: function () {
    game.load.image('stars',    'assets/images/stars.jpg');
    game.load.image('loading',  'assets/images/loading.png');
    game.load.image('brand',    'assets/images/logo.png');
    game.load.script('splash',  'states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');