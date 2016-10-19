"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

const Bullet = require('./bullet.js');
const EntityManager = require('./entity-manager.js');

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, canvas, em) {
  this.worldWidth = canvas.width;
  this.worldHeight = canvas.height;
  this.time = 0;
  this.collisionTime = 0;
  this.lives = 3;
  this.state = "idle";
  this.color = 'red';
  this.position = {
    x: position.x,
    y: position.y
  };
  this.velocity = {
    x: 0,
    y: 0
  }
  this.angle = 0;
  this.radius  = 10;
  this.thrusting = false;
  this.steerLeft = false;
  this.steerRight = false;
  this.fire = false;
  this.em = em;


  var self = this;
  window.onkeydown = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = true;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = true;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = true;
        break;
      case ' ':
        self.fire = true;
        break;
    }
  }

  window.onkeyup = function(event) {
    switch(event.key) {
      case 'ArrowUp': // up
      case 'w':
        self.thrusting = false;
        break;
      case 'ArrowLeft': // left
      case 'a':
        self.steerLeft = false;
        break;
      case 'ArrowRight': // right
      case 'd':
        self.steerRight = false;
        break;
    case ' ':
      self.fire = false;
      break;
    }
  }
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Player.prototype.update = function(time) {

    this.checkShipCollisions(time);
  // Apply angular velocity
  if(this.steerLeft) {
    this.angle += time * 0.005;
  }
  if(this.steerRight) {
    this.angle -= 0.1;
  }
  // Apply acceleration
  if(this.thrusting) {
    var acceleration = {
      x: Math.sin(this.angle),
      y: Math.cos(this.angle)
    }
    this.velocity.x -= acceleration.x/5;
    this.velocity.y -= acceleration.y/5;
  }
  // Apply velocity
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  // Wrap around the screen
  if(this.position.x < 0) this.position.x += this.worldWidth;
  if(this.position.x > this.worldWidth) this.position.x -= this.worldWidth;
  if(this.position.y < 0) this.position.y += this.worldHeight;
  if(this.position.y > this.worldHeight) this.position.y -= this.worldHeight;

  //delete bullets that left the world
  this.time+=time
  if(this.time > MS_PER_FRAME && this.fire){
      var bullet = new Bullet(this.position.x,this.position.y, this.angle, this.em.bullets.length+1);
      this.em.addBullet(bullet);
      this.em.shoot.play();
      this.time = 0;
  }
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Player.prototype.render = function(time, ctx) {
  ctx.save();

  // Draw player's ship
  ctx.translate(this.position.x, this.position.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(0, -10);
  ctx.lineTo(-10, 10);
  ctx.lineTo(0, 0);
  ctx.lineTo(10, 10);
  ctx.closePath();
  ctx.strokeStyle = 'white';
  ctx.stroke();
  //draw player collision


  // Draw engine thrust
  if(this.thrusting) {
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.lineTo(5, 10);
    ctx.arc(0, 10, 5, 0, Math.PI, true);
    ctx.closePath();
    ctx.strokeStyle = 'orange';
    ctx.stroke();
  }
  ctx.restore();
}

Player.prototype.checkShipCollisions = function(time){
    this.collisionTime += time;
    if(this.collisionTime > 5000){
        for(var i = 0; i < this.em.asteroids.length; i++){
            var distCollision = Math.pow(this.radius + this.em.asteroids[i].radius, 2);
            var distSquared = Math.pow(this.position.x - this.em.asteroids[i].x, 2) + Math.pow(this.position.y - this.em.asteroids[i].y, 2);
            if(distSquared < distCollision){
                this.lives--;
                this.reset();
                this.em.shipHit.play();
                console.log("collision");
            }
        }
    }
}

Player.prototype.reset = function(){
    this.position.x = this.worldWidth/2;
    this.position.y = this.worldHeight/2;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.angle = 0;
    this.collisionTime = 0;
}

Player.prototype.warp = function(){
    this.position.x = Math.random()*this.worldWidth;
    this.position.y = Math.random()*this.worldHeight;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.collisionTime = 3000;
}
