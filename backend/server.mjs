import dotenv from 'dotenv'
import express from"./app_server/helper/helperExpress.mjs"
import { 
    // httpsServer,
    httpsServer, 
    webSocket
} from'./app_server/helper/helperProtocol.mjs'
import controllerApi from'./app_server/controller/controllerApi.mjs'
import controlleWebsocket from'./app_server/controller/controllerWebsocket.mjs'
import mongoDb from"./app_server/models/mongoDb.mjs"

const env = dotenv.config()
const app = express()
const port =  10000 || process.env.PORT
const db = mongoDb()
const server = httpServer(app,port)
const socket = webSocket(server,app)

controllerApi(app,"con")
controlleWebsocket(socket,"con")
