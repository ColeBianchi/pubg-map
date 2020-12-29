var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('.'));

console.log(process.env.PORT)

var port = process.env.PORT;

if (port === undefined)
{
	port = 80
}

console.log("Selecting port "+port)

server.listen(port, function ()
{
	console.log('PUBG Map Started!');
});

var points = [];
var current_map = "Erangel";

io.on('connection', function(socket)
{
	//io.sockets.emit("log", "SID: "+socket.id);
	io.sockets.emit('map_update', points);
	io.sockets.emit('current_map', current_map)

	socket.on('disconnect', function()
	{
		points = removeObjectFromArrayByObjectValue(points, "sid", socket.id);
		io.sockets.emit('map_update', points);
	});

	socket.on('point', function(data)
	{
		points = removeObjectFromArrayByObjectValue(points, "sid", socket.id);

		points.push({ sid: socket.id, point: data});

		io.sockets.emit('map_update', points);
	});

	socket.on('map', function(data)
	{
		current_map = data;

		io.sockets.emit('current_map', current_map);
	})
});

function removeObjectFromArrayByObjectValue(array, key, value)
{
	var na = [];

	for (var i = 0; i < array.length; i++)
	{
		if (array[i][key] != value)
		{
			na.push(array[i]);
		}
	}

	return na;
}
