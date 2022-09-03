import userSchema from "../../../schema/user.mjs";

export default async (req,res) => {
	if(!req.query.id) return res.status(400).send("id is required")
	const userId = req.query.id.trim()
	if(!userId) return res.status(400).send("id is not valid")
	try {
		const user = await userSchema.aggregate([
			{$match:{_id:userId}},
		])
		if(!user) return res.status(404).json({"error":"server not found"})
		res.status(200).json({
			userId:user._id,
			name:user.username,
			code:user.code,
		})
		
	} catch (error) {
		res.status(400).json("")
		console.error(first);
	}

}