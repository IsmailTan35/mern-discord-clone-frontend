import messageSchema from '../../../schema/message.mjs';
import serverSchema from '../../../schema/server.mjs';

export default async (io,socket,data)=>{
	if(!socket.handshake.auth.userId || !data || data.to) return

	try {
		
	let rawSockets =await io.fetchSockets()

	const messageSch = new messageSchema({
		sender:socket.handshake.auth.userId,
		receiver:data.receiver,
		message:data.message,
		serverName:data.serverName,
		channelName:data.channelName
	})
	messageSch.readers.push(socket.handshake.auth.userId)
	const msg = await messageSch.save()
	
	if(data.receiver && !data.serverName && !data.channelName){
		const sockets = rawSockets.filter(s=>s.handshake.auth.userId==socket.handshake.auth.userId || s.handshake.auth.userId==data.receiver)
		sockets.map((s,index)=>{
			s.emit("newMessage",[{
				receiver:msg.receiver,
				sender:msg.sender,
				message:msg.message,
				serverName:msg.serverName,
				channelName:msg.channelName,
				messageId:msg._id.toString(),
				timestamps:msg.timestamps,
			}])
		})
	}
	else{
		const server = await serverSchema.findById(data.serverName)

		const sockets = rawSockets.map(socket=>{
			if(server.userIDs.includes(socket.handshake.auth.userId)){
				socket.emit("newMessage",[{
					receiver:msg.receiver,
					sender:msg.sender,
					message:msg.message,
					serverName:msg.serverName,
					channelName:msg.channelName,
					messageId:msg._id.toString(),
					timestamps:msg.timestamps,
				}])
			}
		})
	}
	} catch (error) {
		console.error(error)

	}
}