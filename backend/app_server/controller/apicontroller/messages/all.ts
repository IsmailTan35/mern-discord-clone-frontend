import userSchema from "../../../schema/user";

export default async (req:any,res:any) => {
	try {
		const user:any = await userSchema.find({
			$or:[
				{sender:req.query.id,receiver:req.query.id2},
				{sender:req.query.id,receiver:req.query.id}
			]

		})
		res.status(200).json({
			userId:user._id,
			name:user.username,
			code:user.code,
		})
		
	} catch (error) {
		res.status(400).json("")
		console.error(error)
	}
}