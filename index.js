var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.use(express.static('.'));

server.listen(process.env.PORT, function ()
{
	console.log('PUBG Map Started!');
});

var points = [];

io.on('connection', function(socket)
{	
	//io.sockets.emit("log", "SID: "+socket.id);
	io.sockets.emit('map_update', points);

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