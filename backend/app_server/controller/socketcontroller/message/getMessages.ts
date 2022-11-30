import messageSchema from '../../../schema/message';
export default async (io:any, socket:any, data:any)=>{

	if(!socket.handshake.auth.userId || !data) return
	let messages:any= []
	try {
		

	if(data.receiver){
		 messages = await messageSchema.find({
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
	}
	else{
		 messages = await messageSchema.aggregate(
			[
				{
					$match:{
						$and:[
							{
								serverName:data.serverName,
							},
							{
								channelName:data.channelName,
							}
						]
					}
				},
				{
					$sort:{
						createdAt:-1
					}
				}
			]
		 )
	}
	let rawSockets =await io.fetchSockets()
	const sockets = rawSockets.filter((s:any)=>s.handshake.auth.userId==socket.handshake.auth.userId)
	sockets.map((s:any)=>{
		s.emit("allMessage",messages)
	})
	} catch (error) {
		console.error(error)

	}
}