// import controllerAuth from './controllerAuth.mjs'
// import controllerSocket from './controllerSocket.mjs'
// import verifyToken from "../helper/helperVerify.mjs"

export default (app,con) =>{
    
    app.db = con;
    app.onlineUsers=[];
    // app.post('/api/auth/login', controllerAuth.loginPost)
    // app.post('/api/auth/logout',verifyToken.verify, controllerAuth.logoutPost)
    // app.post('/api/socket',verifyToken.verify, controllerSocket.socketPost)

    // app.ws('/', controllerSocket.socketPost)
    // app.ws('/user', controllerSocket.listenUser)
    app.get('/onlineusers', (req, res) =>{
        res.send({ 
            connections: req.app.onlineUsers.length 
        });
      });
}