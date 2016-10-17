"use strict";
module.exports = exports = EntityManager;

function EntityManager(canvas){
    this.wWidth = canvas.width;
    this.wHeight = canvas.height;
    this.player = undefined;
    this.bullets = [];
    this.asteroids = [];
}

EntityManager.prototype.addPlayer = function(player){
    this.player = player;
}

EntityManager.prototype.addBullet = function(bullet){
    this.bullets.push(bullet);
    console.log(this.bullets);
}
EntityManager.prototype.addAsteroid = function(asteroid){
    this.asteroids.push(asteroid);
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
}

EntityManager.prototype.render = function(time, ctx){
    this.player.render(time, ctx);
    this.bullets.forEach(function(b){
        b.render(time, ctx);
    });
    this.asteroid.forEach(function(a){
        a.render(time, ctx);
    });
}
