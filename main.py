

from flask import Flask, render_template, jsonify
import srcds as rcon

app = Flask(__name__)
tayip = ""
port = 32330
pw = ""

try:
	con = rcon.SourceRcon(tayip, port, pw, 15)
except:
	print 'error'



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
		cleanCoords.append(round((float(coord[2:])/8000)+50, 2)) # convert to Ark map coords
	return cleanCoords


@app.route('/')
def index():
	return render_template('index.html')

@app.route('/getplayerpos')
def getPlayerPOS():
	activePlayers = getPlayers()
	playerList = {"players":[]}
	x = 0
	while x<(len(activePlayers)):
		name = activePlayers[x][3:].split(', ')[0]
		steamid = activePlayers[x][3:].split(', ')[1]
		playerList["players"].append({"name":name, "coords":getPlayerPOSfromSteamID(steamid)})
		x+=1

	return jsonify(playerList)




if __name__ == '__main__':
	app.run(host='10.0.0.36', port=9191, debug=True)