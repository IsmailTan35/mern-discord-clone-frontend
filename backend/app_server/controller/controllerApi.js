var controllerAuth = require('./controllerAuth')
var controllerSocket = require('./controllerSocket')
var verifyToken = require("../helper/helperVerify")

module.exports = function(app,con){
    
    app.db = con;
    app.onlineUsers=[];
    app.post('/api/auth/login', controllerAuth.loginPost)
    app.post('/api/auth/logout',verifyToken.verify, controllerAuth.logoutPost)
    app.post('/api/socket',verifyToken.verify, controllerSocket.socketPost)

    app.ws('/', controllerSocket.socketPost)
    app.ws('/user', controllerSocket.listenUser)
    app.get('/onlinedriver', (req, res) =>{
        res.send({ 
            connections: req.app.onlineUsers.length 
        });
      });
}