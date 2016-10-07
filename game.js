var WIDTH = 300, 
 HEIGHT = 400,
 c = document.getElementById('canvas'),
 ctx = c.getContext('2d');

setInterval(function(){
 clearCanvas();
 updatePosition();
 drawOnCanvas();
}, 1000/50);

var clearCanvas = function(){
 ctx.fillStyle = 'White';
 ctx.beginPath();
 ctx.rect(0, 0, WIDTH, HEIGHT);
 ctx.closePath();
 ctx.fill();
}

var drawLine = function(){
 ctx.beginPath();
 ctx.moveTo(200, 0);
 ctx.lineTo(200, 400);
 ctx.stroke();
}

var updatePosition = function(){
 
}

var drawOnCanvas = function(){
 drawLine();
}


//Initial piece

var speedLevels = [20, 16, 12, 10, 8], 
 currSpeed = speedLevels[0];

var Square = function(speed){
 var self = this;
 self.color = "Black";
        self.vPosition = 0;
self.hPosition = 4;
 self.speed = speed;
 self.temp = 0;

 self.fall = function(){
  if(self.temp == self.speed){
   self.vPosition++;
   self.temp = 0;
  }
  self.temp++;
 }

 self.draw = function(){
  console.log(self.vPosition*squareLength);
  ctx.fillStyle = self.color;  
                ctx.fillRect(self.hPosition*squareLength, self.vPosition*squareLength, squareLength, squareLength); } 
        return self;
}

//Stay there

var gameGrid = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]];

self.fall = function(){
 if(self.counter >= self.speed){
  if(self.checkFalling()){
   self.vPosition++;    
  }
  else{
   gameGrid[self.vPosition][self.hPosition] = 1;
   self.active = false;
  }
  self.counter = 0;
 }
 self.counter++;
}self.checkFalling = function(){
 if(gameGrid[self.vPosition+1][self.hPosition] == 1)
  return false;
 else
  return true;
}
var drawFixedSquares = function(){
 for(var i=0; i<20; i++){
  for(var j=0; j<10; j++){
   if(gameGrid[i][j] == 1){
    ctx.fillStyle = "Black";  
    ctx.fillRect(j*squareLength, i*squareLength, squareLength, squareLength);
   }
  }
 }
}
var generateNextSquare = function(){
 if(!currentSquare.active) 
  currentSquare = new Square(currSpeed);
}
var currentSquare = new Square(currSpeed);

//Move stuff

setInterval(function(){
 clearCanvas();
 generateNextSquare();
 updatePosition();
 drawOnCanvas();
}, 1000/50);
