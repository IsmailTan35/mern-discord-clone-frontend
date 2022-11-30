import {createServer as httpCreate} from "http";

const httpServer = (app:any,port:any) =>{
	const httpServer = httpCreate(app)
	httpServer.listen(port, () =>{
		console.info((new Date()) + ' Http server is listening on port ' + port);
	});
	return httpServer
}

import express from 'express'
import bodyParser from 'body-parser'

import cors from 'cors'

    const app = express();
    // app.use(cors)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cors())
    // app.use(apiRequestLimiter)
    app.get("/",(req:any,res:any)=>{
        res.send("sadas")
    })
const server = httpServer(app,10000)