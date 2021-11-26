
const port = process.env.PORT || 8082

const express = require('express')
var bodyParser  = require('body-parser');
const cors = require("./helperCors")

const app = express()

// app.use(cors)
app.use(express.json())

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
    res.send('hello world')
  })
  console.log("object")

app.listen(8082, () => console.log(`Listening on port ${port}`))

module.exports = app