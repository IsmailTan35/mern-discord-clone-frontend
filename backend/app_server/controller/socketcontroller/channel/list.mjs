import userSchema from "../../../schema/user.mjs";
import serverSchema from "../../../schema/server.mjs";

export default async (io,socket,data)=>{
	const token = socket.handshake.auth.token
	try {
		
		let rawSockets =await io.fetchSockets()
		function findOnlineUser(serverID,channelID){
			const rawRoomName =`server-${serverID}-${channelID}`
			const online = rawSockets.map(socket=>{
				if(socket.rooms.has(rawRoomName)){
					const {name,code,userId}=socket.handshake.auth
					return {
						username:name,
						code:code,
						_id:userId
					}
				}}).filter(item=> item!==undefined)
			return online
		}
		

	if(!token) return
	const res = await userSchema.aggregate([
		{
			$match:{  
				token:{
					$elemMatch:{
						$eq:token
					}
				},
			},
		},
		{
			$lookup:{
				from:"discordservers",
				let:{req:"$servers"},
				pipeline:[
					{
						$match:{
							$expr:{
								$in:["$_id","$$req"],
							},
						},
					},
					{
						$project:{
							_id:1,
							servername:1,
							userIDs:1,
							channels:1,
							inviteCode:1,
						}
					}
				],
				as:"myservers"
			}
		},
		{
			$unwind:"$myservers"
		},
		{
			$replaceRoot:{
				newRoot:"$myservers"
			}
		}
	])
	if(res.length<=0) return

	
	const res1 = await serverSchema.aggregate([
		{
			$lookup:{
				from:"discordchannels",
				let:{req:"$channels"},
				pipeline:[
					{
						$match:{
							$expr:{
								$in:["$_id","$$req"],
							},
						},
					},
					{
						$project:{
							_id:1,
							channelname:1,
							serverID:1,
							group:1,
							locked:1,
							onlineUser:1,
							serverpicture:1,
							type:1
						}
					}
				],
				as:"mychannels"
			}
		},
		{
			$unwind:"$mychannels"
		},
		{
			$replaceRoot:{
				newRoot:"$mychannels"
			}
		}
	])

	const denem1 = res1.map(channel=>(
		{
			...channel,
			onlineUser:findOnlineUser(channel.serverID,channel._id)
		}
	))

	socket.emit("serverList",res)
	socket.emit("channelList",denem1)
} catch (error) {
	console.error(error)

}
}