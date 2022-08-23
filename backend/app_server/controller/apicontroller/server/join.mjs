import serverSchema from "../../../schema/server.mjs";
import userSchema from "../../../schema/user.mjs";

export default async (req,res) => {
	const token = req.headers.authorization
	
	const user = await userSchema.aggregate([
		{$match:{
			token:{"$in":[token]
		}}
	}])

	const server= await serverSchema.aggregate([
		{$match:{inviteCode:req.body.inviteCode}},
	])

	if(user.length==0 || server.length==0) return res.status(400).send("Invalid invite code")

	const data = await userSchema.findOneAndUpdate({
		_id:user[0]._id
	},{
		$push:{
			servers:server[0]._id
		}
	})
	const data2 = await serverSchema.findOneAndUpdate({
		_id:server[0]._id
	},{
		$push:{
			userIDs:user[0]._id
		}
	})

	if(data.length==0 || data2.length==0) return res.status(400).send("Invalid invite code")

	let io = req.app.io

	const rawSockets = await io.fetchSockets()
	const sockets = rawSockets.filter(socket => socket.handshake.auth.token === token)
	sockets.map(socket => {
		socket.emit('newServer',{
			_id:data2._id,
			servername:data2.servername,
			channels:data2.channels,
			userIDs:data2.userIDs,
		})
	})

	res.status(200).send("Success")
}