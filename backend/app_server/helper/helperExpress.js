const express = require('express')
var bodyParser  = require('body-parser');
// const cors = require("./helperCors")
// const rateLimit = require('express-rate-limit')
const app = express()
const cors = require('cors')

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
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
// app.use(apiRequestLimiter)

module.exports = app 