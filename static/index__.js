// $(document).ready(function(){
//     var socket = io.connect('http://' + document.domain + ':' + location.port + '/test');
//     socket.on('my response', function(msg) {
//         console.log('<p>Received: ' + msg.data + '</p>');
//     });
//     $('form#emit').submit(function(event) {
//         socket.emit('my event', {data: $('#emit_data').val()});
//         return false;
//     });
//     $('form#broadcast').submit(function(event) {
//         socket.emit('my broadcast event', {data: $('#broadcast_data').val()});
//         return false;
//     });
// });



var canvas = document.getElementById('myCanvas');
var caveCanvas = document.getElementById('caveCanvas');
var customMarkersCanvas = document.getElementById('customMarkersCanvas');
var map = canvas.getContext('2d');
var players = [];
var clientIDNumber;

document.getElementById('showhidecaves').checked = true;

// var socket = io.connect('http://127.0.0.1:9191/test');

// socket.emit('connect');
// socket.on('connected', function(idnum){
// 	clientIDNumber = idnum;
// 	console.log(clientIDNumber);
// });

// setInterval(function() {
// 	socket.emit('getplayerpos');
// }, 100);

// socket.on('playerPositions' ,function (msg) {
// 	var colors = ["red", "green", "blue", "yellow"]
// 	players = msg.players;
// 	clearMap();
// 	var x = 0    	
// 	for (var player in players){
// 		var coords = players[player]['coords'];
// 		var playerName = players[player]['name'];
// 		mapObject(playerName, coords[0], coords[1], colors[x], "player");
// 		x+=1

// 	}
// });

mapObject('nick', 81,81, 'red', "player");

function getCursorPosition(event) {
    var rect = canvas.getBoundingClientRect();
    var x = event.clientX - rect.left;
    var y = event.clientY - rect.top;
    return [((y*.106875)+7.2), ((x*.106875)+7.2)];
}

var mymarker = [];
var mylatesttap;
function doubletap(event) {
   var now = new Date().getTime();
   var timesince = now - mylatesttap;
   if((timesince < 600) && (timesince > 0)){
   	if (mymarker.length <= 0){
   		customMarkersCanvas.getContext('2d').clearRect(0,0,800,800);
   	}
   	var coords = getCursorPosition(event);
   	mymarker = coords;
   	socket.emit('updateMarkers', coords);

   }else{ // single tap
   			
        }

   mylatesttap = new Date().getTime();
}


document.getElementById('customMarkersCanvas').addEventListener("click", doubletap, false);

function clearMap(){
	map.clearRect(0,0,800,800);
}

function mapObject(name, lat, lon, color, type){
	
	if (type == "player") {
		var objectPOS = canvas.getContext('2d');
		var nameLabel = canvas.getContext('2d');
		objectPOS.beginPath();
		objectPOS.arc( (lat-7.2)/.106875, (lon-7.2)/.106875, 2, 0, 2*Math.PI);
		objectPOS.stroke();
		objectPOS.fillStyle = color;
      	objectPOS.fill();
	
	}
	if (type == "cave") {
		var objectPOS = caveCanvas.getContext('2d');
		var nameLabel = caveCanvas.getContext('2d');
		objectPOS.beginPath();
		objectPOS.arc( (lat-7.2)/.106875, (lon-5)/.106875, 7, 0, 2*Math.PI);
		objectPOS.fillStyle = color;
      	objectPOS.fill();
		objectPOS.stroke();
	}

	if (type == "customMarker"){
		var objectPOS = customMarkersCanvas.getContext('2d');
		var nameLabel = customMarkersCanvas.getContext('2d');
		name = "";
		objectPOS.beginPath();
		objectPOS.arc( (lat-7.2)/.106875, (lon-7.2)/.106875, 5, 0, 2*Math.PI);
		objectPOS.stroke();
		objectPOS.fillStyle = color;
	  	objectPOS.fill();

	}

	nameLabel.fillStyle = "black";
	nameLabel.font = "bold 10px Arial";
	if (type == "player") {
		nameLabel.fillText(name, ((lat-7.2)/.106875)-10, (lon-7.2)/.106875-8, 100, 5);
	}
	if (type == "cave") {
		nameLabel.fillText(name, ((lat-7.2)/.106875)-20, (lon-7.2)/.106875, 100, 5);
	}

}


// function getPlayers(){
// 	var colors = ["red", "green", "blue", "yellow"]
// 	var xhr = new XMLHttpRequest();
// 	xhr.onreadystatechange = function() {
// 	    if (xhr.readyState == XMLHttpRequest.DONE) {
// 	    	var players = JSON.parse(xhr.responseText)['players'];
// 	    	clearMap();
// 	    	var x = 0    	
// 	    	for (var player in players){
// 	    		var coords = players[player]['coords'];
// 	    		var playerName = players[player]['name'];
// 	    		mapObject(playerName, coords[0], coords[1], colors[x], "player");
// 	    		x+=1

// 	    	}
// 	    }
// 	}
// 	xhr.open('GET', '/getplayerpos', true);
// 	xhr.send(null);
// }


function mapCaves() {
	var caves = [{"name":"Central - Clever", "coords":[41.6,47], "color":"green"},
				 {"name":"North West - Skylord", "coords":[19.2,19], "color":"green"},
				 {"name":"Lower South - Hunter", "coords":[80.2,53.5], "color":"green"},
				 {"name":"North East - Devourer", "coords":[14.8,85.3], "color":"green"},
				 {"name":"Upper South - Pack", "coords":[68.2,56.1], "color":"green"},
				 {"name":"South East - Massive", "coords":[70.6,86.1], "color":"green"},
				 {"name":"Swmap Cave - Immune", "coords":[62.7,37.3], "color":"red"},
				 {"name":"Snow Cave - Strong", "coords":[29.1,31.8], "color":"red"},
				 {"name":"Caverns of Lost Faith - Brute", "coords":[53.7,10.4], "color":"cyan"},
				 {"name":"Caverns of Lost Hope - Cunning", "coords":[45.9,88.9], "color":"blue"},
				 {"name":"Tek Cave", "coords":[42.8,39.2], "color":"orange"}]

	for (var cave in caves) {
		caves[cave]
		mapObject(caves[cave]["name"], caves[cave]["coords"][1], caves[cave]["coords"][0], caves[cave]["color"], "cave");
	}

}


function caves(){
	var checkbox = document.getElementById('showhidecaves');
	var cavemap = document.getElementById('caveMap');

	if (checkbox.checked == true) {
		cavemap.style.display = "block";
	}

	if (checkbox.checked == false) {
		cavemap.style.display = "none";
	}
	
}


mapCaves()

