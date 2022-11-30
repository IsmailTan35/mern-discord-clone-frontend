export default (io:any, socket:any, data:any)=>{
	socket.rooms.forEach((element:any) => {
		io.to(element).emit("leftUserVoiceChannelInChannel",{
			_id: socket.handshake.auth.userId,
			username: socket.handshake.auth.name,
			code: socket.handshake.auth.code,
		})
		socket.leave(element)
	});

	socket.emit("closeStreamDevices")
}