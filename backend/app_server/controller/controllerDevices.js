module.exports.devicesPost= function (req,res) {
    var con =req.app.db
    con.query(`SELECT deviceid FROM wt_user_device WHERE userid="${req.body.id}"`, function (err, result, fields) {
        const tokens =Object.values(JSON.parse(JSON.stringify(result))).map(key=> key.deviceid)
        con.query(`SELECT * FROM wt_devices WHERE id IN (${tokens})`, function(err,resultSecond,fields){
            if(resultSecond){
                res.setHeader('Content-Type', 'application/json')
                res.status(200)  
                res.json(resultSecond)
            }
            else{
                res.json("devices error")
                res.status(404)
            }  
        })
       
    })
}