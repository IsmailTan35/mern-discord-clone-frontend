import dotenv from 'dotenv'
import express from"./backend/app_server/helper/helperExpress"
import { 
    CreateServer,
    webSocket
} from'./backend/app_server/helper/helperProtocol'
import controllerApi from'./backend/app_server/controller/apicontroller'
import controlleWebsocket from'./backend/app_server/controller/socketcontroller'
import mongoDb from"./backend/app_server/models/mongoDb"

const env = dotenv.config()
const app = express()
const port = process.env.PORT || 10000 
const db = mongoDb()
const server = CreateServer(app,port)
const socket = webSocket(server)
// app.io=socket

controllerApi(app)
controlleWebsocket(socket,"con")