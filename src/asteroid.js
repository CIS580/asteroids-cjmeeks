"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Asteroid class
 */
module.exports = exports = Asteroid;

/**
 * @constructor Asteroid
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Asteroid(x,y, velocity, angle, radius, canvas, number) {
    this.worldWidth = canvas.width;
    this.worldHeight = canvas.height;
    console.log(number);
    this.astNumber = number;
  this.state = "idle";;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.totalVelocity;
  if(velocity > 2){
      this.totalVelocity = 2;
  }
  else{
      this.totalVelocity = velocity;
  }


  this.velocity = {
    x: Math.sin(angle)* velocity,
    y: Math.cos(angle)* velocity
};
  this.angle = angle;
  this.color = 'white';
}




/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Asteroid.prototype.update = function(time) {
  // Apply velocity
  this.x -= this.velocity.x;
  this.y -= this.velocity.y;

  if(this.x < 0 - this.radius) this.x += this.worldWidth;
  if(this.x > this.worldWidth + this.radius) this.x -= this.worldWidth + (2*this.radius);
  if(this.y < 0 - this.radius) this.y += this.worldHeight + (this.radius * 2);
  if(this.y > this.worldHeight + this.radius) this.y -= this.worldHeight + (2*this.radius);


}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Asteroid.prototype.render = function(time, ctx) {
  ctx.save();
  // Draw bullet
  ctx.strokeStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
  ctx.stroke();
  ctx.restore();
}
