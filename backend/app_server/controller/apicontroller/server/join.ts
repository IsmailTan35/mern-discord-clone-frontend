import serverSchema from "../../../schema/server";
import userSchema from "../../../schema/user";
import channelSchema from "../../../schema/channel";

export default async (req:any,res:any) => {
	const token = req.headers.authorization
	
	try {
		const user:any = await userSchema.aggregate([
			{$match:{
				token:{"$in":[token]
			}}
		}])
	
		const server= await serverSchema.aggregate([
			{$match:{inviteCode:req.body.inviteCode}},
		])
	
		if(user.length==0 || server.length==0) return res.status(400).send("Invalid invite code")
	
		const data:any = await userSchema.findOneAndUpdate({
			_id:user[0]._id
		},{
			$push:{
				servers:server[0]._id
			}
		})
		const data2:any = await serverSchema.findOneAndUpdate({
			_id:server[0]._id
		},{
			$push:{
				userIDs:user[0]._id
			}
		})
	
		if(data.length==0 || data2.length==0) return res.status(400).send("Invalid invite code")
		
		const channels:any = await channelSchema.aggregate([
			{$match:{serverID:server[0]._id.toString()}},
		])
		console.log(channels);
		
		let io = req.app.io
		
		const rawSockets:any = await io.fetchSockets()
		const sockets = rawSockets.filter((socket: { handshake: { auth: { token: any; }; }; }) => socket.handshake.auth.token === token)
		if(sockets.length==0) return

		sockets.map((socket: { emit: (arg0: string, arg1: { _id: any; servername: any; channels: any; userIDs: any; serverpicture: any; }) => void; }) => {
			socket.emit('newServer',{
				_id:data2._id,
				servername:data2.servername,
				channels:data2.channels,
				userIDs:data2.userIDs,
				serverpicture:data2.serverpicture
			})
			channels.forEach((channel: any)=>{
				socket.emit("newChannel",channel)
			})
		})
	res.status(200).send("Success")

		
	} catch (error) {
		console.error(error)
		res.status(400).send("error")
	}

}