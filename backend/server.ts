import dotenv from 'dotenv'
import express from"./app_server/helper/helperExpress"
import { 
    CreateServer,
    webSocket
} from'./app_server/helper/helperProtocol'
// import controllerApi from'./app_server/controller/apicontroller/index.mjs'
// import controlleWebsocket from'./app_server/controller/socketcontroller/index.mjs'
// import mongoDb from"./app_server/models/mongoDb.mjs"

const env = dotenv.config()
const app = express()
const port = process.env.PORT || 10000 
// const db = mongoDb()
const server = CreateServer(app,port)
// const socket = webSocket(server)
// app.io=socket

// controllerApi(app,"con")
// controlleWebsocket(socket,"con")