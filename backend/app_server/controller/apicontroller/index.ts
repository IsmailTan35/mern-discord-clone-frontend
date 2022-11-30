import {
    loginPost,
    logoutPost,
    registerPost,
} from './controllerAuth'
import { verifyPost } from '../../helper/helperVerify'

import {
    friendsGet,
    friendsPost,
    friendsPut,
    friendsDelete,
} from './friend/controllerFriends'

import userSchema from "../../schema/user";
import serverSchema from "../../schema/server";

import joinServer from './server/join';
import createServer from './server/create';
import userInfo from "./user/info"
import serverInfo from "./server/info"
import messageAll from "./messages/all"
import path from "path"

export default (app:any) =>{
    app.get('/',(req:any,res:any) => {
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

    app.get("/api/icon/server/:filename",(req:any,res:any,next:any)=>{
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
          res.sendFile(fileName, options, function (err:any) {
            if (err) {
              next()
            } else {
              console.info('Sent:', fileName)
            }
          })
    })

}