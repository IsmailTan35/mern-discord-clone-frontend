import { request } from "express"
import user from "../schema/user.mjs"

const friendsGet = (req,res) => {
    const { token } = req.query
    console.log(token)
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
    console.log(to)

    const filter = {
        username:to.split("#")[0],
        code:to.split("#")[1],
        friends:{
            $not: {
                $elemMatch:{
                    $eq:{to}
                }
            }
        },
        blocked:{
            $not: {
                $elemMatch:{
                    $eq:{to}
                }
            }
        },
        request:{
            $not: {
                $elemMatch:{
                    $eq:{to}
                }
            }
        }
    }
    
    const filter2 = {
        token:{
            $elemMatch:{
                $eq:token
            },
        },
        friends:{
            $not: {
                $elemMatch:{
                    $eq:{to}
                }
            }
        },
        blocked:{
            $not: {
                $elemMatch:{
                    $eq:{to}
                }
            }
        },
        request:{
            $not: {
                $elemMatch:{
                    $eq:{to}
                }
            }
        }
    }

    const toUpdate = {
        $push:{
            request:{
                to
            }
        }
    }

    const fromUpdate = {
        $push:{
            request:{
                to
            }
        }
    }

    const check1 = await user.findOne(filter)
    if(!check1)  return res.status(400).json("User not found!") 
    const toUpdated = await user.findOneAndUpdate(filter2,{
        $push:{
            request:{
                to:to.split("#")[0]
            }
        }
    })
    if(!toUpdated) return res.status(400).json("User not found!")
    const fromUpdated = await user.findOneAndUpdate(filter,{
        $push:{
            request:{
                from:toUpdated.username
            }
        }
    })

    const denek = await user.find({
        $and: [filter2,filter]
        })
    console.log(denek)
    return
    // await user.findOneAndUpdate(filter,update)
    // await user.findOneAndUpdate(filter,update)


    user.findOneAndUpdate(filter,update).then(result => {
        if(result){
            console.log({username:to.split("#")[0],code:to.split("#")[1]})
            user.findOne({username:to.split("#")[0],code:to.split("#")[1]}).then(result2 => {
                if(result2){
                    user.updateOne({token:{
                        $elemMatch:{
                            $eq:token
                        }
                    }},{$push:{request:{to}}},(err,result3) => {
                        if(err){
                            res.status(500).json(err)
                        }
                        else{
                            res.status(200).json(result3)
                        }
                    })
                }
                else{
                    res.status(404).json({message:"User not found"})
                }
            })
        }
        else{
            res.status(404).json({message:"User not found"})
        }
    })
   
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