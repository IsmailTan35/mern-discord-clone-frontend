import user from "../../../schema/user.mjs"

const friendsGet = (req,res) => {
    const { token } = req.query
    user.findOne({token:{
        $elemMatch:{
            $eq:token
        }
    }},(err,result) => {
        if(err){
            res.status(500).json(err)
        }
        else{
            res.status(200).json(result)
        }
    })

}

const friendsPost = async (req,res) => {
    const { token,to } = req.body
    if(!token || !to) return
    let io = req.app.io

    const checkMe={
        $or:
        [({
            token:{
                $elemMatch:{
                    $eq:token
                }
            }}),
            ({
                username:to.split("#")[0],
                code:eval(to.split("#")[1]),
            })]

        }
        try {
            const check = await user.find(checkMe)
            if(check.length!=2) return
            if(check[0].username+"#"+check[0].code===check[1].username+"#"+check[1].code) return console.log("me")
            const filter = {
                username:check[0].username,
                code:check[0].code,
                friends:{
                    $not: {
                        $elemMatch:{
                            $eq:check[1]._id
                        }
                    }
                },
                blocked:{
                    $not: {
                        $elemMatch:{
                            $eq:check[1]._id
                        }
                    }
                },
                request:{
                    $not: {
                        $elemMatch:{
                            $eq:{
                                type: "outgoing",
                                _id:check[1]._id
                            }
                        }
                    }
                }
            }
    
            const filter2 = {
                username:check[1].username,
                code:check[1].code,
                friends:{
                    $not: {
                        $elemMatch:{
                                $eq:check[0]._id
                            }
                        }
                    },
                blocked:{
                    $not: {
                        $elemMatch:{
                                $eq:check[0]._id
                            }
                        }
                    },
                request:{
                    $not: {
                        $elemMatch:{
                            $eq:{
                                type: "outgoing",
                                _id:check[0]._id
                            }
                        }
                    }
                }
            }
            
            const fromUpdated = await user.findOneAndUpdate(filter,{
                $push:{
                    request:{
                        type:"outgoing",
                        _id:check[1]._id
                    }
                }
            })
        
            if(!fromUpdated) return res.status(400).json("User not found!");
        
            const toUpdated = await user.findOneAndUpdate(filter2,{
                $push:{
                    request:{
                        type:"incoming",
                        _id:check[0]._id
                    }
                }
            })
        
            const rawSockets = await io.fetchSockets()
        
            const sockets =rawSockets.filter(items =>
                items.handshake.auth.userId === check[0]._id.toString() || items.handshake.auth.userId === check[1]._id.toString()
                )
            if(!sockets || sockets.length<=0) return
            // rawSockets.map(socket => {
            //     if(socket.handshake.auth.userId === check[0]._id.toString()){
            //         socket.emit("newFriendRequest",{
            //             type:"outgoing",
            //             code:check[1].code,
            //         })
            //     }
            //     if(socket.handshake.auth.userId === check[1]._id.toString()){
            //         socket.emit("newFriendRequest",{
            //             type:"incoming",
            //             code:check[0].code,
            //         })
            //     }
            //     }
            // )
            res.status(200).json("ok")
        } catch (error) {
            console.error(error)
            res.status(400).json("")
        }


}

const friendsPut = (req,res) => {

}

const friendsDelete = (req,res) => {

}

export {
    friendsGet,
    friendsPost,
    friendsPut,
    friendsDelete
}