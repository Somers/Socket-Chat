var socket = io.connect('http://localhost:3000');
		
socket.on('connect', function(){
	var username = prompt("What's your name?");

	socket.emit('adduser', username);

	$('#users').append('<div>' + username + '</div>');
});

socket.on('updatechat', function (username, data) {
	$('#conversation').append('<div id="msg"><b>'+username + ':</b> ' + data + '<br></div>');
});

socket.on('updaterooms', function(rooms, current_room) {
	$('#rooms').empty();
	$.each(rooms, function(key, value) {
		if(value == current_room){
			$('#rooms').append('<div>' + value + '</div>');
		}
		else {
			$('#rooms').append('<div><a href="#" onclick="switchRoom(\''+value+'\')">' + value + '</a></div>');
		}
		
	});

});

function switchRoom(room){
	socket.emit('switchRoom', room);
}

$(function(){
	$('#datasend').click( function() {
		var message = $('#data').val();
		$('#data').val('');
		
		if( !(message === '' ) ){
			socket.emit('sendchat', message);
		}
	});

	$('#data').keypress(function(e) {
		if(e.which == 13) {
			$(this).blur();
			$('#datasend').focus().click();
		}
	});
});
		