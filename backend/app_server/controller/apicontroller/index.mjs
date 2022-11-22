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

import userSchema from "../../schema/user.mjs";
import serverSchema from "../../schema/server.mjs";

import joinServer from './server/join.mjs';
import createServer from './server/create.mjs';
import userInfo from "./user/info.mjs"
import serverInfo from "./server/info.mjs"
import messageAll from "./messages/all.mjs"
import path from "path"

export default (app,con) =>{
    app.get('/',(req,res) => {
    res.send(req.headers['x-forwarded-for']?.split(',').shift()|| req.socket?.remoteAddress);
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
    app.get("/api/server/getName",serverInfo)
    app.post("/api/server" ,createServer)

    app.get("/api/user/getName",userInfo)
    app.get("/api/user/getMessages",messageAll)

    app.get("/api/icon/server/:filename",(req,res,next)=>{
        let rawPath = `backend/app_server/uploads/server`
        var options = {
            root: path.join(path.resolve(), `${rawPath}`),
            dotfiles: 'deny',
            headers: {
              'x-timestamp': Date.now(),
              'x-sent': true
            }
          }
          var fileName =req.params.filename
          res.sendFile(fileName, options, function (err) {
            if (err) {
              next(err)
            } else {
              console.info('Sent:', fileName)
            }
          })
    })

}