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
	move: true,
	hit: true,
	line_angle: Math.PI*0.5,
	action: "shoot",
	bullet: {
		x: 0,
		y: 0,
		angle: 0,
		created: false
	},
	accuracy: 0.06,
	type: "player"
}

var AI = {
	x: 100,
	y: 100,
	w: 15,
	h: 15,
	move: true,
	hit: true,
	line_angle: Math.PI*0.5,
	action: "shoot",
	bullet: {
		x: 0,
		y: 0,
		angle: 0,
		created: false
	},
	accuracy: 0.06,
	type: "AI"
}

var AI2 = {
	x: 500,
	y: 100,
	w: 15,
	h: 15,
	move: true,
	hit: true,
	line_angle: Math.PI*0.5,
	action: "shoot",
	bullet: {
		x: 0,
		y: 0,
		angle: 0,
		created: false
	},
	accuracy: 0.06,
	type: "AI"
}

var playerList = [player, AI, AI2];
var turn = player;

document.onmousemove = function(event){
	mouseX = event.clientX;
	mouseY = event.clientY;
};

document.onmousedown = function(event){
	if(turn === player){
		executeAction(player);
		
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
	
	for(var i = 0; i < playerList.length; i++){
		if(playerList[i].move === true){
			move(playerList[i]);
		}
		ctx.beginPath();
		ctx.arc((playerList[i].x+(player.w/2)), (playerList[i].y+(playerList[i].h/2)), playerList[i].w, 0, Math.PI*2, true); 
		ctx.closePath();
		ctx.fill();
		if(playerList[i].bullet.created === true){
			moveBullet(playerList[i]);
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
	
	ctx.fillText(player.action, 10, 10);
}

function move(object){
	var pixel = map.getImageData(object.x + (object.w/2) + (Math.cos(object.line_angle)*5), object.y + (object.h/2) + (Math.sin(object.line_angle)*5), 1, 1);
	if(pixel.data[3] === 0 && (object.x + (object.w/2)) > 0 && (object.x + (object.w/2)) < canvas.width && (object.y + (object.h/2)) > 0 && (object.y + (object.h/2)) < canvas.height){
		object.x += Math.cos(object.line_angle)*5;
		object.y += Math.sin(object.line_angle)*5;
	}else{
		if((object.x + (object.w/2)) <= 0){
			object.x = 1 - (object.w/2);
		}else if((object.x + (object.w/2)) >= canvas.width){
			object.x = canvas.width - (object.w/2) - 1;
		}else if((object.y + (object.h/2)) <= 0){
			object.y = 1 - (object.h/2);
		}
		if(object.hit === false){
			object.hit = true;
			object.line_angle = Math.PI*0.5;
		}else{
			console.log('turn: %o', turn);
			if(turn === undefined){
				//nothing
			}else{
				nextTurn();
			}
			object.hit = false;
			object.move = false;
		}
	}
}

function nextTurn(){
	var nextPlayerTurn = playerList.indexOf(turn)+1;
	if(nextPlayerTurn > (playerList.length - 1)){
		nextPlayerTurn = 0;
	}
	turn = playerList[nextPlayerTurn];
	if(turn.type === "AI"){
		var targetplayer = playerList.indexOf(turn)+1;
		if(targetplayer > (playerList.length - 1)){
			targetplayer = 0;
		}
		turn.line_angle = Math.atan2(playerList[targetplayer].x - turn.x, turn.y - playerList[targetplayer].y) + ((Math.random()*(turn.accuracy*2)) - turn.accuracy) - Math.PI*0.5;
		executeAction(turn);
	}
}

function moveBullet(object){
	var pixel = map.getImageData(object.bullet.x + (Math.cos(object.bullet.angle)*5), object.bullet.y + (Math.sin(object.bullet.angle)*5), 1, 1);
	if(pixel.data[3] === 0 && object.bullet.x > 0 && object.bullet.x < canvas.width && object.bullet.y > 0 && object.bullet.y < canvas.height){
		object.bullet.x += Math.cos(object.bullet.angle)*5;
		object.bullet.y += Math.sin(object.bullet.angle)*5;
		for(var i = 0; i < playerList.length; i++){
			if(playerList[i] != object){
				if(object.bullet.x > playerList[i].x && object.bullet.x < (playerList[i].x + playerList[i].w) && object.bullet.y > playerList[i].y &&  object.bullet.y < (playerList[i].y + playerList[i].h)){
					playerList.splice(i, 1);
					object.line_angle = Math.PI*0.5;
					object.move = true;
					object.bullet.created = false;
				}
			}
		}
	}else{
		map.fillStyle = "#fff";
		map.beginPath();
		map.arc(object.bullet.x, object.bullet.y, 30, 0, Math.PI*2, true); 
		map.closePath();
		map.fill();
		object.line_angle = Math.PI*0.5;
		object.move = true;
		object.bullet.created = false;
	}
	ctx.beginPath();
	ctx.arc(object.bullet.x, object.bullet.y, 3, 0, Math.PI*2, true); 
	ctx.closePath();
	ctx.fill();
}

function executeAction(object){
	if(object.action === "move"){
		if(object.move === false){
			object.move = true;
			object.line_angle = Math.atan2(mouseY - (object.y + (object.h/2)), mouseX - (object.x + (object.w/2)));
		}
	}else if(object.action === "shoot"){
		object.bullet.created = true;
		object.bullet.x = object.x + (object.w/2);
		object.bullet.y = object.y + (object.h/2);
		if(object.type === "player"){
			object.bullet.angle = Math.atan2(mouseY - (object.y + (object.h/2)), mouseX - (object.x + (object.w/2))) + ((Math.random()*(object.accuracy*2)) - object.accuracy);
		}else if(object.type === "AI"){
			console.log(object.line_angle);
			object.bullet.angle = object.line_angle;
		}
	}
}

setInterval(draw, 1000/60);

//Draw the 3 floors (horizontal bars)
map.fillRect(0, 200, canvas.width, 40);
map.fillRect(0, 430, canvas.width, 40);
map.fillRect(0, 660, canvas.width, 40);

//Draw  the pillars
map.fillRect(321, 0, 30, 200);
map.fillRect(654, 0, 30, 200);

map.fillRect(485, 210, 30, 230);

map.fillRect(321, 470, 30, 200);
map.fillRect(654, 470, 30, 200);

map.globalCompositeOperation = "destination-out";
