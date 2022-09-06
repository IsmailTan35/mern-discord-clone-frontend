export default async (io,socket,data)=>{
	console.warn("discord disconnected")
	const roomID = socketToRoom[socket.id];
	let room = users[roomID];
	if (room) {
		room = room.filter(id => id !== socket.id);
		users[roomID] = room;
	}
	socket.broadcast.emit("friendLeft", { 
		id: socket.handshake.auth.userId,
		name: socket.handshake.auth.name,
		code: socket.handshake.auth.code
	});
	
	socket.rooms.forEach(element => {
		io.to(element).emit("leftUserVoiceChannelInChannel",{
			_id: socket.handshake.auth.userId,
			username: socket.handshake.auth.name,
			code: socket.handshake.auth.code,
		})
		socket.leave(element)
	});
}