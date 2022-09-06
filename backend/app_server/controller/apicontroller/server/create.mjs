import mongoose from 'mongoose';
import formidable from 'formidable';

import serverSchema from "../../../schema/server.mjs";
import channelSchema from "../../../schema/channel.mjs";

import userSchema from "../../../schema/user.mjs";

export default async (req,res) => {
	let io = req.app.io
	const token = req.headers.authorization
	// console.info(req.files)
	const form = formidable({ multiples: true })
	form.parse(req, async (err, fields, files) => {
		if(err) return res.status(500).json({"error":"server not found"})
		const { serverName } = fields
		if(!serverName || !token) return res.status(400).json("")

		const user = await userSchema.aggregate([
			{$match:{
				token:{"$in":[token]
			}}
		}])

		if(!user.length) return res.sendStatus(401)
		const inviteCode = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);

		const svSchema = new serverSchema({
			servername:serverName,
			inviteCode:inviteCode,
			userIDs:[user[0]._id],
		})

		const chSchema1 =  new channelSchema({
			channelname:"general",
			type:"voice",
			locked:[],
			group:"Voice Channels",
		})

		const chSchema2 =  new channelSchema({
			channelname:"general",
			type:"text",
			locked:[],
			group:"Text Channels",
		})

		svSchema.channels= [
			chSchema1._id,
			chSchema2._id
		]
		chSchema1.serverID=svSchema._id
		chSchema2.serverID=svSchema._id

		svSchema.save()
		chSchema1.save()
		chSchema2.save()

		if(!svSchema) return res.status(401)

		const data = await userSchema.findOneAndUpdate({
			_id:user[0]._id
		},{
			$push:{
				servers:svSchema._id
			}
		},{
			new:true
		}
		)
		
		res.status(200).json({
			serverId:svSchema._id,
			servername:svSchema.servername,
			serverpicture:svSchema.serverpicture,
			userIDs:svSchema.userIDs,
		})

		const rawSockets = await io.fetchSockets()
		const sockets = rawSockets.filter(socket => socket.handshake.auth.token === token)
		sockets.map(socket => {
			socket.emit('newServer',{
				_id:svSchema._id,
				servername:svSchema.servername,
				channels:{
					chSchema1,
					chSchema2
				},
				userIDs:svSchema.userIDs,
				inviteCode:svSchema.inviteCode,
			})
		})
	})
}