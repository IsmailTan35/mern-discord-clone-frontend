import user from "../../../schema/user"

const friendsGet = (req:any,res:any) => {
    const { token } = req.query
    user.findOne({token:{
        $elemMatch:{
            $eq:token
        }
    }},(err: any,result: any) => {
        if(err){
            res.status(500).json(err)
        }
        else{
            res.status(200).json(result)
        }
    })

}

const friendsPost = async (req:any,res:any) => {
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
            const check:any = await user.find(checkMe).sort({_id:-1})
            if(check.length!=2) return
            if(check[0].username+"#"+check[0].code===check[1].username+"#"+check[1].code) return console.info("me")
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
            
            const fromUpdated:any = await user.findOneAndUpdate(filter,{
                $push:{
                    request:{
                        type:"outgoing",
                        _id:check[1]._id
                    }
                }
            })
        
            if(!fromUpdated) return res.status(400).json("User not found!");
        
            const toUpdated:any = await user.findOneAndUpdate(filter2,{
                $push:{
                    request:{
                        type:"incoming",
                        _id:check[0]._id
                    }
                }
            })
        
            const rawSockets:any = await io.fetchSockets()
        
            const sockets =rawSockets.filter((items: { handshake: { auth: { userId: string } } }) =>
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

const friendsPut = (req:any,res:any) => {

}

const friendsDelete = (req:any,res:any) => {

}

export {
    friendsGet,
    friendsPost,
    friendsPut,
    friendsDelete
}