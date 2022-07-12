import messageSchema from '../../../schema/message.mjs';
export default async (io,socket,data)=>{

	if(!socket.handshake.auth.userId || !data || !data.receiver) return
	const messages = await messageSchema.find({
		$in:[
			{
				sender:socket.handshake.auth.userId,
				receiver:data.receiver,
			},
			{
				sender:data.receiver,
				receiver:socket.handshake.auth.userId,
			}
		]
	})
	let rawSockets =await io.fetchSockets()
	const sockets = rawSockets.filter(s=>s.handshake.auth.userId==socket.handshake.auth.userId)
	sockets.map(s=>{
		s.emit("newMessage",messages)
	})
}