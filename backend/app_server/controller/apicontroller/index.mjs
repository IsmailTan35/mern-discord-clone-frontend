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
import serverSchema from "../../schema/server.mjs";

import joinServer from './server/join.mjs';
import createServer from './server/create.mjs';
import { ObjectId } from 'mongodb';


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

    app.post("/api/server/join",joinServer)

    app.get("/api/user/getName",async (req,res) => {
        if(!req.query.id) return res.status(400).send("id is required")
        const userId = req.query.id.trim()
        if(!userId) return res.status(400).send("id is not valid")
        const user = await userSchema.aggregate([
            {$match:{_id:userId}},
        ])

        if(!user) return res.status(404).json({"error":"server not found"})
        // res.status(200).json({
        //     userId:user._id,
        //     name:user.username,
        //     code:user.code,
        // })
    })

    app.get("/api/server/getName",async (req,res) => {
        const server = await serverSchema.findById(req.query.id)
        if(!server) return res.status(404).json({"error":"server not found"})
        res.status(200).json({
            userId:server._id,
            name:server.servername,
            channels:server.channels,
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

    app.post("/api/server" ,createServer)
}