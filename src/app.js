"use strict;"

/* Classes */
const Game = require('./game.js');
const Player = require('./player.js');
const EntityManager = require('./entity-manager.js');
const Asteroid = require('./asteroid.js');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var em = new EntityManager(canvas);
var player = new Player({x: canvas.width/2, y: canvas.height/2}, canvas, em);
var asteroids = [];
var level = 1;
var lives;
var gameEnd = false;
var background = new Image();
background.src  = './assets/background.jpg';
em.addPlayer(player);

em.addAsteroids(level);
em.axisList.sort(function(a,b){return a.x - b.x});

window.onkeyup = function(event) {
  switch(event.key) {
    case 'f':
      em.player.warp();
      break;
  }
}
/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  em.update(elapsedTime);
  lives = player.lives;
  // TODO: Update the game objects

  if(em.asteroids.length < 1){
    level++;
    em.addAsteroids(level);
  }
  if(lives < 1){
    gameEnd = true;
  }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
    if(gameEnd){
        ctx.fillStyle = "white";
        ctx.font = "72px serif";
        ctx.fillText("GAME OVER", 200, 200);
    }
    else{
        ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
        em.render(elapsedTime, ctx);

        if(lives > 0){
            ctx.font = "48px serif";
            ctx.fillStyle = "white";
            ctx.fillText("Lives: " + lives, 550, 50);
        }
        ctx.fillText("Level: " + level, 550, 100);
    }



}
