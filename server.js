// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});
// Usernames that are connected
var usernames = {};

// Already Created Rooms
var rooms = ['General', 'Work-Related-Help', 'Anything'];


app.get('/', function (req, res) {
		res.sendFile( __dirname + '/views/index.html');
});

io.sockets.on('connection', function ( socket ) {
		
		// when a user has connected, add new user
		socket.on('adduser', function ( username ) {
				
				socket.username = username; 
				socket.room = 'General';

				usernames[username] = username; 

				socket.join('General'); 

				socket.emit('updatechat', 'SERVER', 'You are connected on General Chat');

				socket.broadcast.to('General').emit('updatechat', 'SERVER', username + ' has connected!'); 
				socket.broadcast.to('General').emit('updatepeople', username);
				socket.emit('updaterooms', rooms, 'General');
		});

		socket.on('switchRoom', function ( newroom ) {
				socket.leave(socket.room);

				socket.join(newroom);
				socket.emit('updatechat', 'SERVER', 'you have connected to '+ newroom);
				// sent message to OLD room
				socket.broadcast.to(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this room');
				// update socket session room title
				socket.room = newroom;
				socket.broadcast.to(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this room');
				socket.emit('updaterooms', rooms, newroom);
		});

		socket.on('sendchat', function(data) {
			io.sockets.in(socket.room).emit('updatechat', socket.username, data);
		});

		socket.on('disconnect', function(){

			delete usernames[socket.username];
			
			io.sockets.emit('updateusers', usernames);
			
			socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
			
			socket.leave(socket.room);
	});
});

