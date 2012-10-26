var mapCanvas = document.getElementById("map");
var canvas = document.getElementById("canvas");
var map = mapCanvas.getContext("2d");
var ctx = canvas.getContext("2d");

var mouseX = 0;
var mouseY = 0;

var player = {
	x: 500,
	y: 500,
	w: 15,
	h: 15,
	move: false,
	hit: false,
	line_angle: 0,
	action: "shoot",
	bullet: {
		x: 0,
		y: 0,
		angle: 0,
		created: false
	},
	alive: true,
	accuracy: 0.06
}

document.onmousemove = function(event){
	mouseX = event.clientX;
	mouseY = event.clientY;
};

document.onmousedown = function(event){
	if(player.action === "move"){
		if(player.move === false){
			player.move = true;
			player.line_angle = Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2)));
		}
	}else if(player.action === "shoot"){
		player.bullet.created = true;
		player.bullet.x = player.x + (player.w/2);
		player.bullet.y = player.y + (player.h/2);
		player.bullet.angle = Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) + ((Math.random()*(player.accuracy*2)) - player.accuracy);
		console.log(player.bullet.angle);
	}
};

document.onkeydown = function(event){
	keycode = event.keyCode;
	if(keycode === 49){
		player.action = "shoot";
	}
	if(keycode === 50){
		player.action = "move";
	}
}

function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function draw(){
	clear();
	
	if(player.move === true){
		var pixel = map.getImageData(player.x + (player.w/2) + (Math.cos(player.line_angle)*5), player.y + (player.h/2) + (Math.sin(player.line_angle)*5), 1, 1);
		if(pixel.data[3] === 0 && (player.x + (player.w/2)) > 0 && (player.x + (player.w/2)) < canvas.width && (player.y + (player.h/2)) > 0){
			player.x += Math.cos(player.line_angle)*5;
			player.y += Math.sin(player.line_angle)*5;
		}else{
			if((player.x + (player.w/2)) <= 0){
				player.x = 1 - (player.w/2);
			}else if((player.x + (player.w/2)) >= canvas.width){
				player.x = canvas.width - (player.w/2) - 1;
			}else if((player.y + (player.h/2)) <= 0){
				player.y = 1 - (player.h/2);
			}
			if(player.hit === false){
				player.hit = true;
				player.line_angle = Math.PI*0.5;
			}else{
				player.hit = false;
				player.move = false;
			}
		}
	}
	//CREATE THE AIMING LINE
	ctx.beginPath();
	ctx.moveTo((player.x+(player.w/2)), (player.y+(player.h/2)));
	ctx.lineTo(Math.cos(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))))*100 + player.x + (player.w/2), Math.sin(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))))*100 + player.y + (player.h/2));
	ctx.closePath();
	ctx.stroke();
	
	ctx.fillStyle = "rgba(255, 125, 0, 0.5)";
	ctx.beginPath();
	ctx.moveTo((player.x+(player.w/2)), (player.y+(player.h/2)));
	ctx.lineTo(Math.cos(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) - player.accuracy)*100 + player.x + (player.w/2), Math.sin(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) - player.accuracy)*100 + player.y + (player.h/2));
	ctx.lineTo(Math.cos(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) + player.accuracy)*100 + player.x + (player.w/2), Math.sin(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) + player.accuracy)*100 + player.y + (player.h/2));
	ctx.closePath();
	ctx.fill();
	
	ctx.fillStyle = "#000";
	
	//CREATE THE PLAYER (circle)
	ctx.beginPath();
	ctx.arc((player.x+(player.w/2)), (player.y+(player.h/2)), player.w, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
	
	if(player.bullet.created === true){
		var pixel = map.getImageData(player.bullet.x + (Math.cos(player.bullet.angle)*5), player.bullet.y + (Math.sin(player.bullet.angle)*5), 1, 1);
		if(pixel.data[3] === 0){
			player.bullet.x += Math.cos(player.bullet.angle)*5;
			player.bullet.y += Math.sin(player.bullet.angle)*5;
		}else{
			map.fillStyle = "#fff";
			map.beginPath();
			map.arc(player.bullet.x, player.bullet.y, 30, 0, Math.PI*2, true); 
			map.closePath();
			map.fill();
			player.line_angle = Math.PI*0.5;
			player.move = true;
			player.bullet.created = false;
		}
		ctx.beginPath();
		ctx.arc(player.bullet.x, player.bullet.y, 5, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
	}
	
	ctx.fillText(player.action, 10, 10);
}

setInterval(draw, 1000/60);

//Draw the 3 floors (horizontal bars)
map.fillRect(0, 200, canvas.width, 40);
map.fillRect(0, 430, canvas.width, 40);
map.fillRect(0, 660, canvas.width, 40);

map.fillRect(321, 0, 30, 200);
map.fillRect(654, 0, 30, 200);

map.fillRect(485, 210, 30, 230);

map.fillRect(321, 470, 30, 200);
map.fillRect(654, 470, 30, 200);

map.globalCompositeOperation = "destination-out";

player.line_angle = Math.PI*0.5;
player.hit = true;
player.move = true;