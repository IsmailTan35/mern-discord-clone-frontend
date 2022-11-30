import userSchema from "../../../schema/user";

const getFriendBlockeds = async (io:any, socket:any, data:any) => {
	const token = socket.handshake.auth.token
	if(!token) return
	try {
		
	const res:any = await userSchema.aggregate([
		{
			$match:{  
				token:{
					$elemMatch:{
						$eq:token
					}
				}
			}
		},
		{
			$lookup:{
				from:"discordusers",
				let:{requestIDs:"$blocked.id"},
				pipeline:[
					{
						$match:{
							$expr:{
								$in:["$_id","$$requestIDs"]
							}
						}
					}, 
					{
						$project:{
							_id:1,
							username:1,
							code:1
						}
					},
				],
				as:"userBlocked"
			}
		},
		{
			$unwind:"$userBlocked"
		},
		{
			$replaceRoot:{
				newRoot:"$userBlocked"
			}
		}
	])

	if(!res) return
	socket.emit("friendBlockeds",res)
	} catch (error) {
		console.error(error)

	}
}

export {
	getFriendBlockeds
}