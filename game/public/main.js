'use strict';
// let game = new Phaser.Game(800, 600, Phaser.AUTO, 'game'), Main = function () {};
let WINDOW_WIDTH = 750;
let WINDOW_HEIGHT = 500;
let game = new Phaser.Game(WINDOW_WIDTH, WINDOW_HEIGHT, Phaser.AUTO, 'game') , 
  Main = function() {},
  gameOptions = {
    playSound: true,
    playMusic: true
  },
  musicPlayer;

// let Main = function () {};

Main.prototype = {

  preload: function () {
    game.load.image('load-bg',    './assets/images/load-bg.jpg');
    game.load.image('loading',  './assets/images/loading.png');
    game.load.image('logo',    './assets/images/logo.gif');
    game.load.script('splash',  'states/Splash.js');
  },

  create: function () {
    game.state.add('Splash', Splash);
    game.state.start('Splash');
  }

};

game.state.add('Main', Main);
game.state.start('Main');