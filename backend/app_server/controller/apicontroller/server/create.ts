import formidable from 'formidable';

import serverSchema from "../../../schema/server";
import channelSchema from "../../../schema/channel";
import userSchema from "../../../schema/user";
import path from "path";
import fs from "fs"
import { Types } from 'mongoose';

export default async (req:any,res:any) => {
	try {
		
	
	let io = req.app.io
	const token = req.headers.authorization
	const form = formidable({ multiples: true })
	form.parse(req, async (err:any, fields:any, files:any) => {
		if(err) return res.status(500).json({"error":"server not found"})

		const { serverName } = fields
		if(!serverName || !token) return res.status(400).json("")

		const user:any = await userSchema.aggregate([
			{$match:{
				token:{"$in":[token]
			}}
		}])
		if(user.length==0) return res.sendStatus(401)
		const inviteCode = Math.random().toString(36).substring(2, 6) + Math.random().toString(36).substring(2, 6);

		const svSchema = new serverSchema({
			servername:serverName,
			inviteCode:inviteCode,
			userIDs:[user[0]._id],
		})

		if(files && files.serverPhoto && files.serverPhoto.filepath.length){
			try {
				let oldPath=files.serverPhoto.filepath
				let newFileName= `${svSchema._id.toString()}.png`
				let rawPath = `backend/app_server/uploads/server`
				let newPath =path.join(path.resolve(),rawPath,newFileName)
				let rawData = fs.readFileSync(oldPath)
				const res:any = await fs.writeFile(newPath,rawData,()=>{})
				svSchema.serverpicture=newFileName
			} catch (error) {
				if(error) console.error(error);
				svSchema.serverpicture=""
			}
		}
		const chSchema1:any =  new channelSchema({
			channelname:"general",
			type:"voice",
			locked:[],
			group:"Voice Channels",
		})

		const chSchema2:any =  new channelSchema({
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

		await svSchema.save((err:any)=>{
			if(!err) return
			console.error(err);
		})
		await chSchema1.save()
		await chSchema2.save()

		if(!svSchema) return res.status(401)

		const data:any = await userSchema.findOneAndUpdate({
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

		const rawSockets:any = await io.fetchSockets()
		const sockets = rawSockets.filter((socket: { handshake: { auth: { token: any; }; }; }) => socket.handshake.auth.token === token)

		if(sockets.length==0) return
		sockets.map((socket: any) => {
			socket.emit('newServer',{
				_id:svSchema._id,
				servername:svSchema.servername,
				channels:{
					chSchema1,
					chSchema2
				},
				userIDs:svSchema.userIDs,
				inviteCode:svSchema.inviteCode,
				serverpicture:svSchema.serverpicture
			})
			socket.emit("newChannel",
				chSchema1
			)
			socket.emit("newChannel",
			chSchema2
		)
		})
	})
	} catch (error) {
			console.error(error);
	}
}