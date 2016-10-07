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
