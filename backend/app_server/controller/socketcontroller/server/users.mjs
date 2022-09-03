import userSchema from "../../../schema/user.mjs";
import serverSchema from "../../../schema/server.mjs";
import { ObjectId } from "mongodb";

export default async (io,socket,data)=>{
	const { serverId } = data
	const token = socket.handshake.auth.token
	if(!token) return
	try {
	const res = await userSchema.aggregate([
		{
			$match:{
				token:{
					$elemMatch:{
						$eq:token
					}
				},
				servers:{
					$elemMatch:{$eq:serverId}
				}
			},
		},
	])
	const users = await serverSchema.aggregate([
		{
			$match:{
				_id:ObjectId(serverId)
			}
		},
		{
			$lookup:{
				from:"discordusers",
				let:{req:"$userIDs"},
				pipeline:[
					{
						$match:{
							$expr:{
								$in:["$_id","$$req"],
							},
						}
					}
				],
				as:"users"
			}
		},
		{
			$unwind:"$users"
		},
		{
			$replaceRoot:{
				newRoot:"$users"
			}
		},
		{
			$project:{
				_id:0,
				id:"$_id",
				name:"$username",
				code:"$code"
			}
		}

	])
} catch (error) {
	console.error(error)

}
	return
	socket.emit("serverUsers",users)
}