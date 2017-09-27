import srcds as rcon

tayip = "70.130.97.43"
port = 32330
pw = "sS129909847"

try:
	con = rcon.SourceRcon(tayip, port, pw, 15)
except:
	print 'error'
print con.rcon('listplayers')
