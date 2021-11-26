require('dotenv').config()

const con = require('./app_server/models/db')

const app =require("./app_server/helper/helperExpress")
const httpServer =require('./app_server/helper/helperProtocol').httpServer(app)

require('./app_server/controller/controllerApi')(app,con)

// const webSocket = require('./app_server/helper/helperProtocol').webSocket(app,httpServer)