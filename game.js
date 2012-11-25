var mapCanvas = document.getElementById("map");
var canvas = document.getElementById("canvas");
var map = mapCanvas.getContext("2d");
var ctx = canvas.getContext("2d");

var mouseX = 0;
var mouseY = 0;

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var scenes = [];
var currentScene = undefined;

var winner;

var currentmap = 0;
var maps = [{name: "Original Map", AI_amount: 2, spawns: [[100, 188], [500, 648], [800, 418]]}, {name: "Lines Map", AI_amount: 2, spawns: [[100, 188], [500, 628], [800, 418]]}];
var settingsdata = {
	accuracy: 0.06,
}

var AI_difficulty = 0;
var AI_difficulties = ["Easy", "Challenging", "Hard", "Insane"];

var playername = prompt("Please enter your name","player");

var styles = ["Basic black", "Basic red", "Basic blue", "Basic yellow", "Basic green"]
var playerstyle = 0;

var player = {};
var AI = {};
var AI2 = {};

var playerList = [];
var turn = player;

document.onmousemove = function(event){
	mouseX = event.clientX;
	mouseY = event.clientY;
};

document.onmousedown = function(event){
	if(turn === player && currentScene === game){
		executeAction(player);
	}
};

document.onclick = function(event){
	console.log("works");
	event.preventDefault();
	click();
}

document.ontouchend = function(event){
	mouseX = event.touches[0].pageX;
	mouseY = event.touches[0].pageY;
	console.log("works");
	event.preventDefault();
	click();
}

function click(){
	for(i = 0; i < currentScene.UI.length; i++){
		if(currentScene.UI[i].UItype === "button"){
			if(mouseX > currentScene.UI[i].x && mouseX < (currentScene.UI[i].x + currentScene.UI[i].w) && mouseY > currentScene.UI[i].y && mouseY < (currentScene.UI[i].y + currentScene.UI[i].h)){
				currentScene.UI[i].click();
			}
		}
	}
}

document.onkeydown = function(event){
	if(currentScene === game){
		keycode = event.keyCode;
		if(keycode === 49){
			player.action = "shoot";
		}
		if(keycode === 50){
			player.action = "move";
		}
	}
}

scene = function(){
	scenes.push(this);
}

scene.prototype.draw = function(){
	//draw gets called every frame as long as that scene is the current scene.
}

scene.prototype.init = function(){
	//this is what gets called at the very start of the game. It should only be called once.
}

function switchScene(S){
	currentScene = S;
}

function startGame(CurrScene){
	resetgame();
	for(var i = 0; i < scenes.length; i++){
		scenes[i].init();
	}
	switchScene(CurrScene);
	drawGame();
}

function drawGame(){
	clear();
	currentScene.draw();
	gameLoop = requestAnimationFrame(drawGame);
}

var gameLoop = requestAnimationFrame(drawGame);


button = function(xpos, ypos, width, height, buttontext, onclick){
	this.x = xpos;
	this.y = ypos;
	this.w = width;
	this.h = height;
	this.text = buttontext;
	this.buttoncolor = "#999";
	this.UItype = "button";
	this.click = onclick;
	this.corners = 10;
}

button.prototype.draw = function(){
	ctx.fillStyle = this.buttoncolor;
	
	ctx.beginPath();
	ctx.moveTo(this.x + this.corners, this.y);
	ctx.lineTo(this.x + this.w - this.corners, this.y);
	ctx.quadraticCurveTo(this.x + this.w, this.y, this.x + this.w, this.y + this.corners);
	ctx.lineTo(this.x + this.w, this.y + this.h - this.corners);
	ctx.quadraticCurveTo(this.x + this.w, this.y + this.h, this.x + this.w - this.corners, this.y + this.h);
	ctx.lineTo(this.x + this.corners, this.y + this.h);
	ctx.quadraticCurveTo(this.x, this.y + this.h, this.x, this.y + this.h - this.corners);
	ctx.lineTo(this.x, this.y + this.corners);
	ctx.quadraticCurveTo(this.x, this.y, this.x + this.corners, this.y);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	
	//ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.fillStyle = "#000";
	ctx.font = "bold " + (Math.min(this.w, this.h) - 20) + "px 'Architects Daughter'";
	ctx.textAlign = "center";
	ctx.fillText(this.text, this.x + (this.w/2), this.y + (this.h/2 + 10));
}

button.prototype.click = function(){
	if(this.click !== undefined){
		this.click();
	}
}

function drawmap(){
	console.log("map")
	map.globalCompositeOperation = "source-over";
	map.clearRect(0, 0, canvas.width, canvas.height);
	
	if(maps[currentmap].name === "Original Map"){
		map.fillStyle = "#999";
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
	}else if(maps[currentmap].name === "Lines Map"){
		map.fillStyle = "#999";
		//Draw the 3 floors (horizontal bars)
		map.fillRect(0, 200, canvas.width, 60);
		map.fillRect(0, 430, canvas.width, 60);
		map.fillRect(0, 640, canvas.width, 60);
	}
	
	map.globalCompositeOperation = "destination-out";
}

function resetgame(){
	winner = undefined;
	playerList = [];
	drawmap();
	
	player = {
		x: maps[currentmap].spawns[0][0],
		y: maps[currentmap].spawns[0][1],
		w: 15,
		h: 15,
		move: false,
		hit: false,
		line_angle: Math.PI*0.5,
		line_size: 100,
		line_state: "up",
		action: "shoot",
		bullet: {
			x: 0,
			y: 0,
			angle: 0,
			created: false,
			power: 0
		},
		accuracy: settingsdata.accuracy,
		type: "player",
		name: playername,
		style: playerstyle
	};
	playerList.push(player);
	
	if(maps[currentmap].AI_amount > 0){
		AI = {
			x: maps[currentmap].spawns[1][0],
			y: maps[currentmap].spawns[1][1],
			w: 15,
			h: 15,
			move: false,
			hit: false,
			line_angle: Math.PI*0.5,
			action: "shoot",
			bullet: {
				x: 0,
				y: 0,
				angle: 0,
				created: false,
				power: 0
			},
			accuracy: settingsdata.accuracy,
			type: "AI",
			name: "StupidAI#1",
			style: 0
		};
		playerList.push(AI);
	}
	if(maps[currentmap].AI_amount > 1){
		AI2 = {
			x: maps[currentmap].spawns[2][0],
			y: maps[currentmap].spawns[2][1],
			w: 15,
			h: 15,
			move: false,
			hit: false,
			line_angle: Math.PI*0.5,
			action: "shoot",
			bullet: {
				x: 0,
				y: 0,
				angle: 0,
				created: false,
				power: 0
			},
			accuracy: settingsdata.accuracy,
			type: "AI",
			name: "StupidAI#2",
			style: 0
		};
		playerList.push(AI2);
	}
	
	turn = player;
}

var menu = new scene()
menu.init = function(){
	this.UI = [
		new button(100, 250, 300, 50, "Play game!", function(){resetgame(); switchScene(game);}),
		new button(100, 325, 300, 50, "Settings", function(){switchScene(settings);}),
		new button(825, 475, 50, 50, ">", function(){currentmap+=1;if(currentmap > (maps.length - 1)){currentmap = 0;};drawmap();}),
		new button(625, 475, 50, 50, "<", function(){currentmap-=1;if(currentmap < 0){currentmap = maps.length - 1;};drawmap();}),
		new button(825, 550, 50, 50, ">", function(){AI_difficulty+=1;if(AI_difficulty > (AI_difficulties.length - 1)){AI_difficulty = 0;};}),
		new button(625, 550, 50, 50, "<", function(){AI_difficulty-=1;if(AI_difficulty < 0){AI_difficulty = AI_difficulties.length - 1;};})
	];
}
menu.draw = function(){
	canvas.style.cursor = "default";
	for(i = 0; i < this.UI.length; i++){
		this.UI[i].draw();
	}
	ctx.font = "100px 'Architects Daughter'";
	ctx.textAlign = "center";
	ctx.fillText("Pencil Game", 500, 110);
	ctx.font = "20px 'Architects Daughter'";
	ctx.textAlign = "left";
	ctx.fillText("Alpha", 775, 110);
	
	ctx.textAlign = "center";
	ctx.fillText(maps[currentmap].name, 750, 510);
	ctx.fillText(AI_difficulties[AI_difficulty], 750, 585);
	ctx.drawImage(mapCanvas, 550, 200, 400, 250);
	ctx.strokeRect(550, 200, 400, 250);
	
	ctx.beginPath();
	ctx.moveTo(500, 150);
	ctx.lineTo(500, 600);
	ctx.closePath();
	ctx.stroke();
}

var settings = new scene();
settings.init = function(){
	this.UI = [
		new button(325, 150, 50, 50, ">", function(){settingsdata.accuracy+=0.01;if(settingsdata.accuracy > 0.1){settingsdata.accuracy = 0.01};}),
		new button(210, 150, 50, 50, "<", function(){settingsdata.accuracy-=0.01;if(settingsdata.accuracy < 0.01){settingsdata.accuracy = 0.1};}),
		new button(350, 550, 300, 50, "Back to menu", function(){switchScene(menu);}),
		new button(600, 190, 300, 40, "Change name", function(){playername = prompt("Please enter your name","player");}),
		new button(850, 425, 50, 50, ">", function(){playerstyle+=1;if(playerstyle>(styles.length-1)){playerstyle = 0};}),
		new button(600, 425, 50, 50, "<", function(){playerstyle-=1;if(playerstyle<0){playerstyle = (styles.length-1)};}),
	];
}
settings.draw = function(){
	canvas.style.cursor = "default";
	for(i = 0; i < this.UI.length; i++){
		this.UI[i].draw();
	}
	ctx.font = "70px 'Architects Daughter'";
	ctx.textAlign = "center";
	ctx.fillText("Settings", 500, 100);
	
	ctx.font = "20px 'Architects Daughter'";
	ctx.textAlign = "left";
	ctx.fillText("Accuracy", 100, 180);
	ctx.fillText("What else should I add here?", 100, 250);
	ctx.textAlign = "center";
	ctx.fillText(settingsdata.accuracy*100, 290, 180);
	
	ctx.fillText(playername, 750, 170);
	ctx.beginPath();
	ctx.arc(750, 325, 70, 0, Math.PI*2, true); 
	ctx.closePath();
	changestyle(playerstyle);
	ctx.fillStyle = "#000";
	ctx.fillText(styles[playerstyle], 750, 455);
	
	ctx.beginPath();
	ctx.moveTo(500, 150);
	ctx.lineTo(500, 500);
	ctx.closePath();
	ctx.stroke();
}

var game = new scene()
game.init = function(){
	this.UI = [];
}
game.draw = function(){
	if(playerList.length <= 1){
		winner = turn.name;
		switchScene(gameover);
	}
	ctx.drawImage(mapCanvas, 0, 0);
	canvas.style.cursor = "crosshair";
	for(var i = 0; i < playerList.length; i++){
		if(playerList[i].move === true){
			move(playerList[i]);
		}
		ctx.beginPath();
		ctx.arc((playerList[i].x+(playerList[i].w/2)), (playerList[i].y+(playerList[i].h/2)), playerList[i].w, 0, Math.PI*2, true); 
		ctx.closePath();
		changestyle(playerList[i].style);
		ctx.fillStyle = "#000";
		ctx.font = "10px Arial";
		ctx.textAlign = "center";
		ctx.fillText(playerList[i].name, playerList[i].x+(playerList[i].w/2), playerList[i].y - 10);
		if(playerList[i].bullet.created === true){
			moveBullet(playerList[i]);
		}
	}
	
	if(turn === player){
		//CREATE THE AIMING LINE
		ctx.beginPath();
		ctx.moveTo((player.x+(player.w/2)), (player.y+(player.h/2)));
		ctx.lineTo(Math.cos(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))))*100 + player.x + (player.w/2), Math.sin(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))))*100 + player.y + (player.h/2));
		ctx.closePath();
		ctx.stroke();
		
		if(player.line_state === "up"){
			player.line_size += 3;
			if(player.line_size >= 100){
				player.line_state = "down";
			}
		}else if(player.line_state === "down"){
			player.line_size -= 3;
			if(player.line_size <= 0){
				player.line_state = "up";
			}
		}
		
		ctx.fillStyle = "rgba(" + Math.round((255/100)*player.line_size) + ", " + (255 - Math.round((255/100)*player.line_size)) + ", 0, 1)";
		ctx.beginPath();
		ctx.moveTo((player.x+(player.w/2)), (player.y+(player.h/2)));
		ctx.lineTo(Math.cos(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) - player.accuracy)*player.line_size + player.x + (player.w/2), Math.sin(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) - player.accuracy)*player.line_size + player.y + (player.h/2));
		ctx.lineTo(Math.cos(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) + player.accuracy)*player.line_size + player.x + (player.w/2), Math.sin(Math.atan2(mouseY - (player.y + (player.h/2)), mouseX - (player.x + (player.w/2))) + player.accuracy)*player.line_size + player.y + (player.h/2));
		ctx.closePath();
		ctx.fill();
		ctx.fillStyle = "#000";
		ctx.font = "12px Arial";
		ctx.textAlign = "left";
		ctx.fillText(player.action, 10, 12);
	}
}

var gameover = new scene()
gameover.init = function(){
	this.UI = [
		new button(350, 150, 300, 50, "Back to menu", function(){switchScene(menu);drawmap();})
	]
}
gameover.draw = function(){
	canvas.style.cursor = "default";
	for(i = 0; i < this.UI.length; i++){
		this.UI[i].draw();
	}
	ctx.fillStyle = "#000";
	ctx.font = "70px 'Architects Daughter'";
	ctx.textAlign = "center";
	ctx.fillText("winner is " + winner, 500, 100);
}

function clear(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function changestyle(number){
	ctx.stroke();
	if(styles[number] === "Basic black"){
		ctx.fillStyle = "#333";
		ctx.fill();
	}else if(styles[number] === "Basic red"){
		ctx.fillStyle = "#b11";
		ctx.fill();
	}else if(styles[number] === "Basic blue"){
		ctx.fillStyle = "#33b";
		ctx.fill();
	}else if(styles[number] === "Basic yellow"){
		ctx.fillStyle = "#cc0";
		ctx.fill();
	}else if(styles[number] === "Basic green"){
		ctx.fillStyle = "#1b1";
		ctx.fill();
	}
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
		}else if((object.y + (object.h/2)) >= canvas.height){
			object.y = canvas.height - (object.h/2) - 1;
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
		if(playerList.length > 1){
			var targetplayer;
			for(i = 0; i < playerList.length; i++){
				if(playerList[i] !== turn){
					if(targetplayer === undefined){
						targetplayer = i;
					}else{
						var dx = playerList[i].x-turn.x;
						var dy = playerList[i].y-turn.y;
						var dx2 = playerList[targetplayer].x-turn.x;
						var dy2 = playerList[targetplayer].y-turn.y;
						if(Math.sqrt(dx*dx+dy*dy) < Math.sqrt(dx2*dx2+dy2*dy2)){
							targetplayer = i;
						}
					}
				}
			}
			if(targetplayer > (playerList.length - 1)){
				targetplayer = 0;
			}
			turn.line_angle = Math.atan2(playerList[targetplayer].x - turn.x, turn.y - playerList[targetplayer].y) + ((Math.random()*(turn.accuracy*2)) - turn.accuracy) - Math.PI*0.5;
			executeAction(turn);
		}
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

startGame(menu);

