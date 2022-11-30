import { ObjectId } from "mongodb";
import userSchema from "../../../schema/user";
export default async (io:any, socket:any, data:any)=>{
	const { userId } = data
	try {
	const res:any = await userSchema.findOne({_id:new ObjectId(userId)})
	socket.emit("newUserInfo",{
		id:res._id,
		name:res.username,
		code:res.code,
	})
	} catch (error) {
		console.error(error)

	}
}