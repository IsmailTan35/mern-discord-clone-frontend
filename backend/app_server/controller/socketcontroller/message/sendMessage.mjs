import messageSchema from '../../../schema/message.mjs';

export default async (io,socket,data)=>{
	if(!socket.handshake.auth.userId || !data || data.to) return
	let rawSockets =await io.fetchSockets()
	const messageSch = new messageSchema({
		sender:socket.handshake.auth.userId,
		receiver:data.receiver,
		message:data.message,
		serverName:data.serverName,
		channelName:data.channelName
	})

	const msg = await messageSch.save()
	const sockets = rawSockets.filter(s=>s.handshake.auth.userId==socket.handshake.auth.userId || s.handshake.auth.userId==data.receiver)
	sockets.map(s=>{
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