import userSchema from "../../../schema/user";
import serverSchema from "../../../schema/server";
import { ObjectId } from "mongodb";

export default async (io:any, socket:any, data:any)=>{
	const { serverId } = data
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
				},
				servers:{
					$elemMatch:{$eq:serverId}
				}
			},
		},
	])
	const users:any = await serverSchema.aggregate([
		{
			$match:{
				_id:new ObjectId(serverId)
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
	socket.emit("serverUsers",users)
	} catch (error) {
		console.error(error)

	}
}