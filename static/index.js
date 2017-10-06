

// Phaser
var game = new Phaser.Game(1024, 768, Phaser.CANVAS, 'gameDiv', { preload: preload, create: create, update: update });
var socket = io.connect(window.location.hostname +  ':9191/players');

var o_mcamera;
var map;
var players = {};
var x = 70.6;
var y = 86.1;


function preload() {
	game.load.image('map', '../static/assets/arkmap.jpg');
	game.load.spritesheet('implant', '../static/assets/implant.png');
}

function create() {
	game.world.setBounds(0, 0, 1750, 1600);

	map = game.add.image(0,0,'map');
	map.scale.setTo(2,2);

	// get players and current position from sse
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == XMLHttpRequest.DONE) {
	    	var activePlayers = JSON.parse(xhr.responseText)['players'];
			for (var player in activePlayers){
				var currentPlayer;
				var coords = activePlayers[player]['coords'];
				var playerName = activePlayers[player]['name'];
				var playerID = activePlayers[player]['steamID'];
				
				currentPlayer = game.add.sprite((coords[0]-7.2)/.054685, (coords[1]-7.2)/.054685,'implant');
				currentPlayer.scale.setTo(.25,.25);

				var text = game.add.text(-100, -80, playerName, {font: "64px Arial", fill: "#ffffff", backgroundColor: "#000000"});
				currentPlayer.addChild(text);

				var button = document.createElement("button");
				button.innerHTML = playerName;
				button.id = playerName;

				var playerButtons = document.getElementById("playerButtons");
				playerButtons.appendChild(button);

				document.getElementById(playerName).addEventListener("click", function(){
					game.camera.target = null;
					game.camera.x = currentPlayer.position.x-300;
					game.camera.y = currentPlayer.position.y-300;
					game.camera.follow(players[playerName]['playerObject']);
				});

				players[playerName] = {'playerObject':currentPlayer, 'playerID':playerID, 'playerName':playerName};			
			}
		}
	}
	xhr.open('GET', '/getPlayers', true);
	xhr.send(null);
}


function update() {
    move_camera_by_pointer(game.input.mousePointer);
    move_camera_by_pointer(game.input.pointer1);
}

function move_camera_by_pointer(o_pointer) {
    if (!o_pointer.timeDown) { return; }
    if (o_pointer.isDown && !o_pointer.targetObject) {
        if (o_mcamera) {
        	game.camera.target = null;
            game.camera.x += o_mcamera.x - o_pointer.position.x;
            game.camera.y += o_mcamera.y - o_pointer.position.y;
        }
        o_mcamera = o_pointer.position.clone();
    }
    if (o_pointer.isUp) { o_mcamera = null; }
}


setInterval(function(){
	for (var player in players){
		var myData = {playerID:players[player]['playerID'], playerName:players[player]['playerName']};
		socket.emit('getPlayerPOS', {data: myData});
		socket.on('playerPosition', function(msg){
			var coords = msg.coords;
			var playerName = msg.playerName;
			
			players[playerName]['playerObject'].position.x = (coords[0]-7.2)/.054685
			players[playerName]['playerObject'].position.y = (coords[1]-7.2)/.054685
		})
	}
}, 1500)

