require('dotenv').config()

// const con = require('./app_server/models/db')

const app =require("./app_server/helper/helperExpress")

const httpServer =require('./app_server/helper/helperProtocol').httpServer(app,10000)

require('express-ws')(app,httpServer)

require('./app_server/controller/controllerApi')(app,"con")