import userSchema from "../../../schema/user";

export default async(io:any,socket:any,data:any)=>{
	try {
		

	let user:any = await userSchema.findOne({token:{"$in":[data.token]}})
	if(!user) return
	
	let ids =user._id.toString()
	socket.handshake.auth.name = user.username
	socket.handshake.auth.code = user.code
	socket.handshake.auth.userId = ids
	socket.handshake.auth.token = data.token

	if(!socket.handshake.auth.token || !socket.handshake.auth.name)  return

	const rawSockets:any = await io.fetchSockets()
	const sockets = rawSockets.filter((items:any) => items.handshake.auth.userId && 
		socket.handshake.auth.userId !== items.handshake.auth.userId &&
		user.friends.includes(items.handshake.auth.userId))
	let onlineUsers:any =[]
	if(!sockets) return

	sockets.map(function(elem:any){
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
		// messages:messages[socket.id],
		onlineUsers,
		// users,
		// socketToRoom
	}
	
	socket.emit("data", datak);
	sockets.map((s:any) => {
		if(!s.handshake.auth.userId) return
		s.emit("friendJoin", { 
			userId: socket.handshake.auth.userId,
			name: socket.handshake.auth.name,
			code: socket.handshake.auth.code
		});
	})
	} catch (error) {
		console.error(error)

	}
}