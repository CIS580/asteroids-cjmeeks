(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./asteroid.js":2,"./entity-manager.js":4,"./game.js":5,"./player.js":6}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
"use strict";
module.exports = exports = EntityManager;
const Vector = require('./vector.js');
const Asteroid = require('./asteroid.js');

function EntityManager(canvas){
    this.wWidth = canvas.width;
    this.wHeight = canvas.height;
    this.player = undefined;
    this.canvas = canvas;
    this.bullets = [];
    this.asteroids = [];
    this.axisList = [];
    this.bulletAsteroid = [];
    this.shoot = new Audio('./assets/Laser_Shoot.wav');
    this.hit = new Audio('./assets/Explosion.wav');
    this.shipHit = new Audio('./assets/ShipHit.wav');
}

EntityManager.prototype.addPlayer = function(player){
    this.player = player;
}

EntityManager.prototype.addBullet = function(bullet){
    this.bullets.push(bullet);
}
EntityManager.prototype.addAsteroids = function(level){
    for(var i = 0; i < 9 + level; i++){
        var temp = new Asteroid(Math.random()*this.canvas.width, Math.random()*this.canvas.height, Math.random()*2, Math.random()* 360, Math.random()* (50 - 20) + 20,this.canvas, i+1);
        this.asteroids.push(temp);
    }
    this.axisList = this.asteroids;
    this.axisList.sort(function(a,b){return a.x - b.x});
    console.log(this.asteroids);
}

EntityManager.prototype.update = function(time){
    this.player.update(time);
    var index = 0;
    var self = this;
    this.bullets.forEach(function(b){
        if(b.x < 0) self.bullets.splice(index,1);
        if(b.y < 0) self.bullets.splice(index,1);
        if(b.x > self.wWidth) self.bullets.splice(index,1);
        if(b.y > self.wHeight) self.bullets.splice(index,1);
        index++;
    });
    this.bullets.forEach(function(b){
        b.update(time);
    });
    this.asteroids.forEach(function(a){
        a.update(time);
    });
    //resort after asteroids move
    this.axisList.sort(function(a,b){return a.x - b.x});
    //active list holds all asteroids we are considering for collisions
    this.checkAsteroidCollisions();
    this.checkBulletCollisions();
}

EntityManager.prototype.render = function(time, ctx){
    this.player.render(time, ctx);
    this.bullets.forEach(function(b){
        b.render(time, ctx);
    });
    this.asteroids.forEach(function(a){
        a.render(time, ctx);
    });
}

EntityManager.prototype.deleteAsteroid = function(collisions){
    if(collisions !== undefined){
        var ast = this.asteroids;
        var axis = this.axisList;
        var temp;
        var numbers = [];

        //delete from asteroids

        collisions.forEach(function(index){
            temp = ast.splice(index.asteroid, 1);
            numbers.push(temp[0].astNumber);
        });
        this.asteroids = ast;
        for(var i = 0; i < this.asteroids.length; i++){
            this.asteroids[i].astNumber = i + 1;
        }
        this.axisList = this.asteroids;
        this.axisList.sort(function(a,b){return a.x - b.x});
    }

}
EntityManager.prototype.deleteBullet = function(collisions){
    if(collisions !== undefined){
        var bulls = this.bullets;
        collisions.forEach(function(index){
            bulls.splice(index.bullet, 1);
        });
        this.bullets = bulls;
        for(var i = 0; i < this.bullets.length; i++){
            this.bullets[i].number = i + 1;
        }
    }

}

EntityManager.prototype.checkBulletCollisions = function(){
    var collisions = [];
    var asteroidsKilled = [];

    for(var i = 0; i < this.bullets.length; i++){
        for(var j = 0; j < this.asteroids.length; j++){
            var distanceSqrd = Math.pow(this.bullets[i].x - this.asteroids[j].x ,2) + Math.pow(this.bullets[i].y - this.asteroids[j].y ,2);
            var bulletDistance = Math.pow(this.asteroids[j].radius, 2);
            if(distanceSqrd < bulletDistance){
                collisions.push({bullet: i, asteroid: j});
                asteroidsKilled.push(this.asteroids[j]);
                console.log("bulletkill")
            }
        }
    }
    //handle collisions
    this.deleteAsteroid(collisions);
    this.deleteBullet(collisions);
    var ast = this.asteroids;
    var canvas = this.canvas;
    asteroidsKilled.forEach(function(a){
        if(a.radius/2 >= 10){
            console.log("split");
            var x1 = (Math.cos(a.angle+90)*a.radius) + a.x + 10;
            var y1 = (Math.sin(a.angle+90)*a.radius) + a.y + 10;
            var ast1 = new Asteroid(x1, y1,a.totalVelocity, (a.angle+90), Math.floor(a.radius/2), canvas, ast.length+1);
            ast.push(ast1);
            var x2 = (Math.cos(a.angle-90)*a.radius) + a.x + 10;
            var y2 = (Math.sin(a.angle-90)*a.radius) + a.y + 10;
            ast.push(new Asteroid(x2, y2,a.totalVelocity, (a.angle-90), Math.floor(a.radius/2), canvas, ast.length+1));
        }
    });

    this.asteroids = ast;
    this.axisList = ast;
    this.axisList.sort(function(a,b){return a.x - b.x});
}

EntityManager.prototype.checkAsteroidCollisions = function(){
    var active = [];
    //potentailly colliding asteroids
    var potentiallyColliding = [];
    //remove asteroids from active list that are too far away from current asteroids
    //all asteroids closer than the max radius of the 2 asteroids stay
    this.axisList.forEach(function(a, aindex){
        active = active.filter(function(b){
            return a.x - b.x < (a.radius + b.radius);
        });
        active.forEach(function(b, bindex){
            potentiallyColliding.push({a: a, b: b});
        });
        //finnaly add current asteroid to current active array to consider it in the next pass down the axis list
        a.color = 'white';
        active.push(a);
    });
    //now have a potentiallyColliding list
    //now check for real collisions and store those in a collision array
    var collisions = [];
    var hit = this.hit;
    potentiallyColliding.forEach(function(pair){
        var distSquared = Math.pow(pair.a.x - pair.b.x, 2) + Math.pow(pair.a.y - pair.b.y, 2);
        //(15+15)^2 = 900 -> sum of 2 asteroids raidius squared
        var distCollision = Math.pow((pair.a.radius + pair.b.radius), 2);
        if(distSquared < distCollision){
            pair.a.color = 'red';
            pair.b.color = 'red';
            collisions.push(pair);
            hit.play();
        }
    });

    //process collisions
    collisions.forEach(function(pair){
        var collisionNormal = {
            x: pair.a.x - pair.b.x,
            y: pair.a.y - pair.b.y
        }
        var overlap = (pair.a.radius + pair.b.radius + 5) - Vector.magnitude(collisionNormal);
        var collisionNormal = Vector.normalize(collisionNormal);

        pair.a.x += collisionNormal.x * overlap / 2;
        pair.a.y += collisionNormal.y * overlap / 2;
        pair.b.x -= collisionNormal.x * overlap / 2;
        pair.b.y -= collisionNormal.y * overlap / 2;

        var angle = Math.atan2(collisionNormal.y, collisionNormal.x);
        var a = Vector.rotate(pair.a.velocity, angle);
        var b = Vector.rotate(pair.b.velocity, angle);
        //solves the collision
        var s = a.x;
        a.x = b.x;
        b.x = s;
        //rotate the asteroid back to game space
        a = Vector.rotate(a, -angle);
        b = Vector.rotate(b, -angle);
        pair.a.velocity.x = a.x;
        pair.a.velocity.y = a.y;
        pair.b.velocity.x = b.x;
        pair.b.velocity.y = b.y;
    });
}

},{"./asteroid.js":2,"./vector.js":7}],5:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],6:[function(require,module,exports){
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

},{"./bullet.js":3,"./entity-manager.js":4}],7:[function(require,module,exports){
module.exports = exports = {
    rotate: rotate,
    dotProduct: dotProduct,
    magnitude: magnitude,
    normalize: normalize
}

//rotates a vector about the z axis
function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

//computes the dot product of two vectors
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

//computes the magnitude of a vector
function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

//normalizes the vector
function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

},{}]},{},[1]);
