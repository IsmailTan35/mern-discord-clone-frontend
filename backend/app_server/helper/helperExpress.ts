import express from 'express'
import bodyParser from 'body-parser'
// import cors from "./helperCors"
// import rateLimit from'express-rate-limit'
import cors from 'cors'

const App = () =>{
    const app = express();
    // const apiRequestLimiter = rateLimit({
    //     windowMs: 1 * 60 * 1000, // 1 minute
    //     max: 10, // limit each IP to 2 requests per windowMs
    //     handler: function (req, res, /*next*/) {
    //         return res.status(429).json({
    //           error: 'You sent too many requests. Please wait a while then try again'
    //         })
    //     }
    // })

    // app.use(cors)
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(express.json())
    app.use(cors())
    // app.use(apiRequestLimiter)
    app.get("/",(req:any,res:any)=>{
        res.send("sadas")
    })
    return app
} 

export default App