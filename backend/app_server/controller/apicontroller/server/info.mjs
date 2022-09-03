import serverSchema from "../../../schema/server.mjs";
export default async (req,res) => {
	try {
		const server = await serverSchema.findById(req.query.id)
		if(!server) return res.status(404).json({"error":"server not found"})
		res.status(200).json({
			userId:server._id,
			name:server.servername,
			channels:server.channels,
		})
	} catch (error) {
		console.error(error)
		res.status(400).json("")
	}
}