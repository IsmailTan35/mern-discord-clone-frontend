import userSchema from "../../../schema/user";

const getFriendRequests = async (io:any, socket:any, data:any) => {
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
	} catch (error) {
		console.error(error)

	}
}

const acceptFriendRequest = async (io:any, socket:any, data:any) => {
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
				// username:data.username,
				// code:data.code,
			})
		]
	}
	try {
		

	const check:any = await userSchema.find(checkMe)
	if(check.length!=2) return
	if(check[0].username+"#"+check[0].code===check[1].username+"#"+check[1].code) return console.info("me")
	const update:any = await userSchema.findOneAndUpdate({
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

	const update2:any = await userSchema.findOneAndUpdate({
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
	const rawSockets:any = await io.fetchSockets()
	rawSockets.map((socket:any)=>{
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
} catch (error) {
	console.error(error)

}
}

const rejectFriendRequest = async (io:any, socket:any, data:any) => {
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
				// username:data.username,
				// code:data.code,
			})
		]
	}
	try {
		

	const check:any = await userSchema.find(checkMe)
	if(check.length!=2) return
	if(check[0].username+"#"+check[0].code===check[1].username+"#"+check[1].code) return console.info("me")

	const update:any = await userSchema.findOneAndUpdate({
		username:check[0].username,
		code:check[0].code,
	},{
		$pull:{
			request:{
				_id:check[1]._id
			}
		}
	},
	{new:true})

	const update2:any = await userSchema.findOneAndUpdate({
		username:check[1].username,
		code:check[1].code,
	},{
		$pull:{
			request:{
				_id:check[1]._id
			}
		}
	},
	{new:true})
	const rawSockets:any = await io.fetchSockets()
	rawSockets.map((socket:any)=>{
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
} catch (error) {
	console.error(error)

}
}

const cancelFriendRequest = async (io:any,socket:any, data:any) => {
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
				// username:data.username,
				// code:data.code,
			})
		]
	}
	try {
		

	const check:any = await userSchema.find(checkMe)
	if(check.length!=2) return
	if(check[0].username+"#"+check[0].code===check[1].username+"#"+check[1].code) return console.info("me")

	const update:any = await userSchema.findOneAndUpdate({
		username:check[0].username,
		code:check[0].code,
	},{
		$pull:{
			request:{
				_id:check[1]._id
			}}
	},
	{new:true})

	const update2:any = await userSchema.findOneAndUpdate({
		username:check[1].username,
		code:check[1].code,
	},{
		$pull:{
			request:{
				_id:check[0]._id
			}}
	},
	{new:true})
	const rawSockets:any = await io.fetchSockets()
	rawSockets.map((socket:any)=>{
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
	} catch (error) {
		console.error(error)

	}
}

export {
	getFriendRequests,
	acceptFriendRequest,
	rejectFriendRequest,
	cancelFriendRequest
}