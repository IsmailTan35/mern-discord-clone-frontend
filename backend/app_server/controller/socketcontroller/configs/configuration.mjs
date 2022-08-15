import userSchema from "../../../schema/user.mjs";

export default async(io,socket,data)=>{
	var user = await userSchema.findOne({token:{"$in":[data.token]}})
	if(!user) return
	
	var ids =user._id.toString()
	socket.handshake.auth.name = user.username
	socket.handshake.auth.code = user.code
	socket.handshake.auth.userId = ids
	socket.handshake.auth.token = data.token

	if(!socket.handshake.auth.token || !socket.handshake.auth.name)  return

	const rawSockets = await io.fetchSockets()
	const sockets = rawSockets.filter(items => items.handshake.auth.userId && 
		socket.handshake.auth.userId !== items.handshake.auth.userId &&
		user.friends.includes(items.handshake.auth.userId))
	let onlineUsers =[]
	if(!sockets) return

	sockets.map(function(elem){
		onlineUsers.push({
				name:elem.handshake.auth.name, 
				code:elem.handshake.auth.code,
				id:elem.id,
				userId:elem.handshake.auth.userId,
			});
	  })
	  
	const datak ={
		userId: socket.handshake.auth.userId,
		name: socket.handshake.auth.name,
		code: socket.handshake.auth.code,
		messages:messages[socket.id],
		onlineUsers,
		users,
		socketToRoom
	}
	
	socket.emit("data", datak);
	sockets.map(s => {
		if(!s.handshake.auth.userId) return
		s.emit("friendJoin", { 
			userId: socket.handshake.auth.userId,
			name: socket.handshake.auth.name,
			code: socket.handshake.auth.code
		});
	})
}