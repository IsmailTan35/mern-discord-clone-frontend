import userSchema from "../../../schema/user.mjs";

const getFriendRequests = async (io,socket, data) => {
	const token = socket.handshake.auth.token
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
				from:"discordusers",
				let:{req:"$request"},
				pipeline:[
					{
						$match:{
							$expr:{
								$in:["$_id","$$req._id"],
							},
							
						}
					},
					{
						$project:{
							_id:1,
							username:1,
							code:1
						}
					}
				],
				as:"requests"
			}
		},
		{
			$addFields:{
				data:{$concatArrays:["$request","$requests"]}
			}
		},
		{
			$unwind:"$data"
		},
		{
			$group:{
				_id:"$data._id",
				data:{
					$mergeObjects:"$data"
				}
			}
		},
		{
			$replaceRoot:{
				newRoot:"$data"
			}
		}

	])

	if(!res) return
	socket.emit("friendRequests", res)
}

const acceptFriendRequest = async (io,socket, data) => {
	const token = socket.handshake.auth.token
	if(!token) return
	const checkMe = {
		$or:[
			({
			token:{
				$elemMatch:{
					$eq:token
				}
			}}),
			({
				_id:data._id,
				username:data.username,
				code:data.code,
			})
		]
	}
	const check = await userSchema.find(checkMe)
	console.log(check.length)
	if(check.length!=2) return
	if(check[0].username+"#"+check[0].code===check[1].username+"#"+check[1].code) return console.log("me")
	const update = await userSchema.findOneAndUpdate({
		username:check[0].username,
		code:check[0].code,
	},{
		$push:{
			friends:check[1]._id},
		$pull:{
			request:{
				_id:check[1]._id
			}
		}
	},
	{new:true})

	const update2 = await userSchema.findOneAndUpdate({
		username:check[1].username,
		code:check[1].code,
	},{
		$push:{
			friends:check[0]._id},
		$pull:{
			request:{
				_id:check[0]._id
			}
		}
	},
	{new:true})
	console.log("first")
	const rawSockets = await io.fetchSockets()
	rawSockets.map((socket)=>{
		console.log(socket.handshake.auth.userId,check[0]._id.toString())
		if(socket.handshake.auth.userId===check[0]._id.toString()){
			socket.emit("newFriend",check[1]._id)
			socket.emit("friendRequestsRemove",{
				name:check[1].username,
				code:check[1].code,
				})

		}
		if(socket.handshake.auth.userId===check[1]._id.toString()){
			socket.emit("newFriend",{
				name:check[0].username,
				code:check[0].code,
				})
			socket.emit("friendRequestsRemove",check[0]._id)

		}
	})
}

const rejectFriendRequest = async (io,socket, data) => {
	const token = socket.handshake.auth.token
	if(!token) return
	const checkMe = {
		$or:[
			({
			token:{
				$elemMatch:{
					$eq:token
				}
			}}),
			({
				username:data.name,
				code:data.code,
			})
		]
	}
	const check = await userSchema.find(checkMe)
	if(check.length!=2) return
	if(check[0].username+"#"+check[0].code===check[1].username+"#"+check[1].code) return console.log("me")

	const update = await userSchema.findOneAndUpdate({
		username:check[0].username,
		code:check[0].code,
	},{
		$pull:{
			request:check[1]._id}
	},
	{new:true})

	const update2 = await userSchema.findOneAndUpdate({
		username:check[1].username,
		code:check[1].code,
	},{
		$pull:{
			request:check[0]._id}
	},
	{new:true})
	const rawSockets = await io.fetchSockets()
	rawSockets.map((socket)=>{
		console.log(socket.handshake.auth.userId,check[0]._id.toString())
		if(socket.handshake.auth.userId===check[0]._id.toString()){
			socket.emit("friendRequestsRemove",{
				name:check[1].username,
				code:check[1].code,
				})

		}
		else if(socket.handshake.auth.userId===check[1]._id.toString()){
			socket.emit("friendRequestsRemove",check[0]._id)

		}
	})
}

const cancelFriendRequest = async (io,socket, data) => {
	const token = socket.handshake.auth.token
	if(!token) return
	const checkMe = {
		$or:[
			({
			token:{
				$elemMatch:{
					$eq:token
				}
			}}),
			({
				_id:data._id,
				username:data.username,
				code:data.code,
			})
		]
	}
	const check = await userSchema.find(checkMe)
	if(check.length!=2) return
	if(check[0].username+"#"+check[0].code===check[1].username+"#"+check[1].code) return console.log("me")

	const update = await userSchema.findOneAndUpdate({
		username:check[0].username,
		code:check[0].code,
	},{
		$pull:{
			request:{
				_id:check[1]._id
			}}
	},
	{new:true})

	const update2 = await userSchema.findOneAndUpdate({
		username:check[1].username,
		code:check[1].code,
	},{
		$pull:{
			request:{
				_id:check[0]._id
			}}
	},
	{new:true})
	const rawSockets = await io.fetchSockets()
	rawSockets.map((socket)=>{
		if(socket.handshake.auth.userId===check[0]._id.toString()){
			socket.emit("friendRequestsRemove",{
				name:check[1].username,
				code:check[1].code,
				})

		}
		else if(socket.handshake.auth.userId===check[1]._id.toString()){
			socket.emit("friendRequestsRemove",check[0]._id)

		}
	})
}

export {
	getFriendRequests,
	acceptFriendRequest,
	rejectFriendRequest,
	cancelFriendRequest
}