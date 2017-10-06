import random
from flask import Flask, render_template, jsonify
import srcds as rcon
from flask_socketio import SocketIO, send, emit
from decimal import Decimal


# 7.2 -- 97.5


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)

tayip = ""
port = 32330
pw = ""

try:
	con = rcon.SourceRcon(tayip, port, pw, 30)
except:
	print 'error'

	
@socketio.on('getPlayerPOS', namespace='/players')
def playerpos(data):

	emit('playerPosition', {'coords':getPlayerPOSfromSteamID(data['data']['playerID']), 'playerName':data['data']['playerName']})



def getPlayers():
	players = con.rcon('listplayers').splitlines()
	#remove empty elements
	players.pop(0)
	players.pop(len(players)-1)
	return players

def getPlayerPOSfromSteamID(id):
	coords = str(con.rcon("getplayerpos " + str(id))).strip().split(' ')
	cleanCoords = []
	for coord in coords:
		try:
			cleanCoords.append(round((float(coord[2:])/8000)+50, 2)) # convert to Ark map coords
		except:
			pass
	return cleanCoords



@app.route('/getPlayers')
def getPlayerPOS_init():
	activePlayers = getPlayers()
	playerList = {"players":[]}
	x = 0
	while x<(len(activePlayers)):
		name = activePlayers[x][3:].split(', ')[0]
		steamid = activePlayers[x][3:].split(', ')[1]
		playerList["players"].append({"name":name, "coords":getPlayerPOSfromSteamID(steamid), "steamID":steamid})
		x+=1

	return jsonify(playerList)


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/test')
def test_temp():
	return render_template('test.html')


if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port="9191", debug=True)


# if __name__ == '__main__':
# 	app.run(host='10.0.0.36', port=9191, debug=True)