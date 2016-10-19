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
