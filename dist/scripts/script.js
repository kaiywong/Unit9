/*
    Coding Test January 2015

*/
/*var player = function(x_offset, y_offset, radius, colour) {

    	var private = {
  
			x_offset : x_offset,
			y_offset : y_offset,
      radius: radius,
      colour: colour,

		}
		return {
		    get: function( prop ) {
		      if ( private.hasOwnProperty( prop ) ) {
		        return private[ prop ];
		      }
		    },

		   x: x_offset,
		   y: y_offset,
       r: radius,
       colour: colour,

  		}

	};
*/
// var player = function(x_offset, y_offset, radius, colour) {
//   this.base = Sprite;
//   this.base(400, 50, 10, "#FF0000");
// }

// player.prototype = new Sprite;

function Circle(x,y,r,c){
  this.x=x;
  this.y=y;
  this.r=r;
  this.colour = c;
}

var Platform = function(x1,y1,x2,y2){
  this.x1 =x1;
  this.y1 = y1;
  this.x2 = x2;
  this.y2 = y2;
}

var player =function() {
    Circle.apply(this, arguments);
    this.colour = "#00FF00";
    this.isLoaded = true;
    this.facing = "E";
 
    this.move= function(facing){

      if(facing == "N")
      {
        this.y-=6;
      }
      else if (facing == "E")
      {
        this.x+=6;
        this.facing ="E";
      }
      else if (facing == "S")
      {
        //nothing for now
      }
      else if (facing == "W")
      {
        this.x-=6;
        this.facing = "W";
      }

    };

    this.shoot = function(){
    
      return (this.isLoaded);
    };
}


var Enemy =function() {
    Circle.apply(this, arguments);
    this.colour = "#000000";
    this.alive = true;
    this.movingEast = true;

    this.move= function(){
      if(Math.random() <.1){
        this.movingEast = !this.movingEast;
      }
      if(this.movingEast){
        this.x+=3;
      }
      else
      {
        this.x-=3;
      
      }

    };
}

var FlyingEnemy =function() {
    Enemy.apply(this, arguments);
    this.colour = "#FF5555";
    this.hovering = false;
    this.move= function(){
      if(Math.random() <.1){
        this.movingEast = !this.movingEast;
      }
      if(this.hovering){
        if(Math.random() <.5){
          this.hovering = false;
        }
      }
      else{
        if(Math.random() <.1){
          this.hovering = true;
        }
      }
      if(this.movingEast){
        this.x+=3;
      }
      else
      {
        this.x-=3;
      
      }

      if(this.hovering){
        this.y-=6;
      }

    };
}

var round =function(x,y,facing) {
    this.x = x;
    this.y = y;
    this.colour = "#FF0000";
    this.inBounds = true;
    this.facing = facing;
    this.move= function(){
      if(this.facing =="E"){
          this.x+=9;
      }
      else{
        this.x-=9;
      }
    }
}

// 'main' state that will contain the game
var mainState = {
 
    create: function() { 
        // This function is called after the preload function     
        // Here we set up the game, display sprites, etc. 
        this.canvas = document.getElementById("myCanvas");//$("#myCanvas");
        this.ctx = this.canvas.getContext("2d");

        this.floor = 500;
        this.Platforms=[];
        this.setPlatforms();
        this.addPlayer();
        this.addKeyListeners();
        this.isMoving =false;
        this.isShooting = false;
        this.facing = "E";
        this.Enemies =[];
        this.addEnemies();
        this.Rounds = [];
    },

    update: function() {
        // This function is called 60 times per second    
        // It contains the game's logic   
 
        if(this.isMoving){
          this.player1.move(this.facing);
          
          this.isMoving =false;
        }
        this.applyGravity(this.player1);

  
        for(i=0;i<this.Enemies.length;i++){
          this.Enemies[i].move();
          this.applyGravity(this.Enemies[i]);
        }

         for(i=0;i<this.Rounds.length;i++){
          this.Rounds[i].move();
          if(this.outOfBounds(this.Rounds[i])){
            this.Rounds.splice(i,1);
          }
        }

        if(this.isShooting){
   
          if(this.player1.shoot()){
        
            this.addRound();        
          }
          this.isShooting =false;
        }

        this.checkCollisions();

        this.drawAll();
        // this.circle.x+=1;
        // this.circle.y+=1;
    },

    setPlatforms:function(){
      //hard code for now
      this.Platforms[0] = new Platform(0,510,800,510);
      this.Platforms[1] = new Platform(0,300,200,300);
      this.Platforms[2] = new Platform(400,100,800,100);
      this.Platforms[3] = new Platform(700,400,800,400);
     
    },

    addPlayer:function(){
      this.player1 = new player( 50,500,10,"#FF0000" );
 
    },

    addEnemies:function(num){
      //this.Enemies = [];
      // for(i=0;i<num;i++)
      // {}
      this.Enemies[0] = new Enemy( 400,500,10,"#FF0000" );
      this.Enemies[1] = new FlyingEnemy( 600,500,10,"#FF0000" );
    },

    removeEnemy:function(index){
      this.Enemies.splice(index,1);
    },

    addRound:function(){
      this.Rounds[this.Rounds.length]=new round(this.player1.x,this.player1.y,this.player1.facing);

    },

    removeRound:function(index){
      this.Rounds.splice(index,1);
    },

    applyGravity:function(sprite){
      if(sprite.y<this.floor){
        sprite.y +=2;
      }

      if(sprite.y<=0){
        sprite.y =0;
      }
      if(sprite.x<=0){
        sprite.x =0;
      }
      if(sprite.x>=this.canvas.width){
        sprite.x = this.canvas.width;
      }

    },

    outOfBounds: function(round){
      return((round.x > this.canvas.width ) || (round.x<5)); 
    },

    checkCollisions: function(){
      for(var i=0; i<this.Rounds.length;i++){
        for(var j=0;j<this.Enemies.length;j++){
          var dx= (this.Rounds[i].x - this.Enemies[j].x)*(this.Rounds[i].x - this.Enemies[j].x);
          var dy= (this.Rounds[i].y - this.Enemies[j].y)*(this.Rounds[i].y - this.Enemies[j].y);
          if((dy+dx)<this.Enemies[j].r){
            this.removeRound(i);
            this.removeEnemy(j);
          }
        }
      }

    },

    drawAll:function(){
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      function drawPlatform(p,ctx) {

        ctx.fillStyle= "#000000";
        ctx.moveTo(p.x1,p.y1);
        ctx.lineTo(p.x2,p.y2);
        ctx.stroke();
      }

      function drawBall(c,ctx) {

        ctx.fillStyle=c.colour;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI*2, true);
        ctx.fill();
      }

      function drawRound(c,ctx) {
         

        ctx.fillStyle=c.colour;
        ctx.moveTo(c.x,c.y);
        ctx.lineTo(c.x+10,c.y);
        ctx.stroke();
      }


      drawBall(this.player1, this.ctx);

      for(i=0;i<this.Enemies.length;i++){
        drawBall(this.Enemies[i],this.ctx);
      }

      for(i=0;i<this.Rounds.length;i++){

        drawRound(this.Rounds[i],this.ctx);
      }

      for(i=0;i<this.Platforms.length;i++){

        drawPlatform(this.Platforms[i],this.ctx);
      }

    },


    addKeyListeners: function(){
      me=this;
         $(function() {
           $(window).keypress(function(e) {
               var key = e.which;
               e.preventDefault();

 
                if (key == 119)
                { 
                me.facing = "N";
                me.isMoving = true;
                
                }
                else if (key == 100)
                { 
                me.facing = "E";
                me.isMoving = true;  
                }
                else if (key == 115)
                { 
                me.facing = "S";
                me.isMoving = true;  
                }
                else if (key == 97)
                { 
                me.facing = "W";
                me.isMoving = true;  
                }
                else if (key == 32)
                { 
                
                  me.isShooting=true;
                }

           });
        });
    }
    
};



$( document ).ready(function() {
	console.log( "ready!" );
	mainState.create();
    var interval = self.setInterval(function(){mainState.update()},50);
});