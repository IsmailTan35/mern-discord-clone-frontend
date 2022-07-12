import {
    loginPost,
    logoutPost,
    registerPost,
} from './controllerAuth.mjs'
import { verifyPost } from '../../helper/helperVerify.mjs'

import {
    friendsGet,
    friendsPost,
    friendsPut,
    friendsDelete,
} from './friend/controllerFriends.mjs'
// import controllerSocket from './controllerSocket.mjs'
import userSchema from "../../schema/user.mjs";

export default (app,con) =>{

    app.get('/',(req,res) => {
        res.statusCode = 200;
		res.setHeader('Content-Type', 'text/html');
		res.end(`<h1>${req.headers['x-forwarded-for']?.split(',').shift()|| req.socket?.remoteAddress}</h1>`);
    })
    
    app.post("/api/auth/login",loginPost)
    app.post("/api/auth/logout",logoutPost)
    app.post("/api/auth/register",registerPost)
    app.post("/api/auth/check",verifyPost)

    app.get("/api/friend",friendsGet)
    app.post("/api/friend",friendsPost)
    app.put("/api/friend",friendsPut)
    app.delete("/api/friend",friendsDelete)

    app.get("/api/user/getName",async (req,res) => {
        const user = await userSchema.findById(req.query.id)
        res.status(200).json({
            userId:user._id,
            name:user.username,
            code:user.code,
        })
    })

    app.get("/api/user/getMessages",async (req,res) => {
        const user = await userSchema.find({
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
    })
}