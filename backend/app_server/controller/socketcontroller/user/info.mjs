import { ObjectId } from "mongodb";
import userSchema from "../../../schema/user.mjs";
export default async (io,socket,data)=>{
	const { userId } = data
	try {
	const res = await userSchema.findOne({_id:ObjectId(userId)})
	socket.emit("newUserInfo",{
		id:res._id,
		name:res.username,
		code:res.code,
	})
	} catch (error) {
		console.error(error)

	}
}