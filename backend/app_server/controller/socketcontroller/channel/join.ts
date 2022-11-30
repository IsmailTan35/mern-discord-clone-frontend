import userSchema from "../../../schema/user";
import serverSchema from "../../../schema/server";

export default async(io:any, socket:any, data:any)=>{
	const token = socket.handshake.auth.token
	if(!token) return
	try {
		

	const user:any = await userSchema.aggregate([
		{$match:{
			token:{"$in":[token]
		}}
	}])

	if(!user) return

	const rawRoomName =`server-${data.serverID}-${data.channelID}`
	let rawSockets =await io.fetchSockets()
	if(socket.rooms.has(rawRoomName)) return
	
	socket.rooms.forEach((element:any) => {
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

	const server:any = await serverSchema.findById(data.serverID)

	const sockets = rawSockets.map((socket:any)=>{
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
				channelID:data.channelID,
				signal:data.signal,
				me:socket.handshake.auth.userId===user[0]._id ? null :data.signal
			})
		}
	})
	} catch (error) {
		console.error(error)

	}
}