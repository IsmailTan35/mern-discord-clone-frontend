import userSchema from "../../../schema/user.mjs";
import serverSchema from "../../../schema/server.mjs";

export default async(io,socket,data)=>{
	const token = socket.handshake.auth.token
	if(!token) return
	const user = await userSchema.aggregate([
		{$match:{
			token:{"$in":[token]
		}}
	}])
	const rawRoomName =`server-${data.serverID}-${data.channelID}`
	let rawSockets =await io.fetchSockets()
	
	if(socket.rooms.has(rawRoomName)) return
	
	socket.rooms.forEach(element => {
		io.to(element).emit("leftUserVoiceChannelInChannel",{
			_id:user[0]._id,
			username:user[0].username,
			code:user[0].code,
			serverID:data.serverID,
			channelID:data.channelID
		})
		socket.leave(element)
	});
	socket.join(rawRoomName)

	const server = await serverSchema.findById(data.serverID)

	const sockets = rawSockets.map(socket=>{
		if(server.userIDs.includes(socket.handshake.auth.userId)){
			socket.emit("leftUserVoiceChannelInChannel",{
				_id:user[0]._id,
				username:user[0].username,
				code:user[0].code,
				serverID:data.serverID,
				channelID:data.channelID
			})
			socket.emit("joinUserVoiceChannelInChannel",{
				_id:user[0]._id,
				username:user[0].username,
				code:user[0].code,
				serverID:data.serverID,
				channelID:data.channelID
			})
		}
	})
	// io.to(rawRoomName).emit("joinUserVoiceChannel",{
	// 	_id:user[0]._id,
	// 	username:user[0].username,
	// 	code:user[0].code,
	// 	serverID:data.serverID,
	// 	channelID:data.channelID
	// });
}