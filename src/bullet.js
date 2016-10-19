"use strict";

const MS_PER_FRAME = 1000/8;

/**
 * @module exports the Bullet class
 */
module.exports = exports = Bullet;

/**
 * @constructor Bullet
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Bullet(x,y, angle, number) {
  this.state = "idle";
  this.number = number;
  this.x = x;
  this.y = y;
  this.absVelocity = 4;
  this.velocity = {
    x: Math.sin(angle)* this.absVelocity,
    y: Math.cos(angle)* this.absVelocity
};

  this.angle = angle;
  this.radius  = 2;
}



/**
 * @function updates the player object
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 */
Bullet.prototype.update = function(time) {
  // Apply velocity
  this.x -= this.velocity.x;
  this.y -= this.velocity.y;
}

/**
 * @function renders the player into the provided context
 * {DOMHighResTimeStamp} time the elapsed time since the last frame
 * {CanvasRenderingContext2D} ctx the context to render into
 */
Bullet.prototype.render = function(time, ctx) {
  ctx.save();
  // Draw bullet
  ctx.translate(this.x, this.y);
  ctx.rotate(-this.angle);
  ctx.beginPath();
  ctx.moveTo(-3, 0);
  ctx.lineTo(-3, 6);
  ctx.lineTo(3, 6);
  ctx.lineTo(3, 0);
  ctx.closePath();
  ctx.fillStyle = 'white';
  ctx.fill();


  ctx.restore();
}
