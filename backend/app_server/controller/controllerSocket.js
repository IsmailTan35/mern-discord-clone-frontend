module.exports.socketPost =function (req,res) {
    var con =req.app.db
    res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(JSON.stringify({
        data: {
            devices:{},
            positions:{},
            events:{}
        }
        }))
        res.end()
}