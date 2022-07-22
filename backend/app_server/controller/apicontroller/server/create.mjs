import mongoose from 'mongoose';
import formidable from 'formidable';

import serverSchema from "../../../schema/server.mjs";
import userSchema from "../../../schema/user.mjs";

export default async (req,res) => {
	let io = req.app.io
	const token = req.headers.authorization
	// console.log(req.files)
	const form = formidable({ multiples: true })
	form.parse(req, async (err, fields, files) => {
		if(err) return res.status(500).json({"error":"server not found"})
		const { serverName } = fields
		if(!serverName || !token) return res.status(400)

		const user = await userSchema.aggregate([
			{$match:{
				token:{"$in":[token]
			}}
		}])

		if(!user.length) return res.sendStatus(401)
		const id= mongoose.Types.ObjectId()
		const id2= mongoose.Types.ObjectId()
		const inviteCode = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);
		
		const server = await serverSchema.model('discordserver').create({
			servername:serverName,
			inviteCode:inviteCode,
			// serverpicture:req.body.serverpicture,
			userIDs:[user[0]._id],
			channels:[{
				channelName:"general",
				_id: id,
				type:"text",
				locked:false,
				group:"Text Channels",
			},
			{
				channelName:"general",
				_id: id2,
				type:"voice",
				locked:false,
				group:"Voice Channels",
			},
		]
		})

		if(!server) return res.status(401)

		const data = await userSchema.findOneAndUpdate({
			_id:user[0]._id
		},{
			$push:{
				servers:server._id
			}
		},{
			new:true
		}
		)
		
		res.status(200).json({
			serverId:server._id,
			servername:server.servername,
			serverpicture:server.serverpicture,
			userIDs:server.userIDs,
		})

		const rawSockets = await io.fetchSockets()
		const sockets = rawSockets.filter(socket => socket.handshake.auth.token === token)
		sockets.forEach(socket => {
			socket.emit('newServer',{
				_id:server._id,
				servername:server.servername,
				channels:server.channels,
				userIDs:server.userIDs,
				inviteCode:server.inviteCode,
			})
		})
	})
}