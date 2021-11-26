
var generateAccessToken = require("../helper/helperToken").generateAccessToken
var generateRefreshToken = require("../helper/helperToken").generateRefreshToken

module.exports.loginPost = function(req,res){
  var con =req.app.db
  const { email, password } = req.body
  
  con.query(`SELECT * FROM wt_users WHERE email="${email}" AND hashedpassword="${password}"`, function (err, resultFirst, fields) {
    if (resultFirst.length>0){
    const accessToken = generateAccessToken(resultFirst)
    const refreshToken = generateRefreshToken(resultFirst)
    con.query(`UPDATE wt_user_token SET token = "${accessToken}", refresh_token = "${refreshToken}"  WHERE user_id=${resultFirst[0].id}`, function (err, resultSecond, fields) {
      res.setHeader('Content-Type', 'application/json')
      res.status(200)  
      res.json({
          id: resultFirst[0].id,
          attributes:resultFirst[0].attributes==="{}"? {}:resultFirst[0].attributes,
          name: resultFirst[0].name,
          login: resultFirst[0].login,
          email: resultFirst[0].email,
          phone: resultFirst[0].phone,
          readonly: resultFirst[0].readonly,
          map: resultFirst[0].map,
          latitude: resultFirst[0].latitude,
          longitude: resultFirst[0].longitude,
          zoom: resultFirst[0].zoom,
          lastscreen: resultFirst[0].lastscreen,
          twelveHourFormat:resultFirst[0].twelveHourFormat,
          coordinateFormat: resultFirst[0].coordinateFormat,
          disabled: resultFirst[0].disabled,
          expirationTime: resultFirst[0].expirationTime,
          deviceLimit: resultFirst[0].deviceLimit,
          userLimit: resultFirst[0].userLimit,
          deviceReadonly: resultFirst[0].deviceReadonly,
          limitCommands: resultFirst[0].limitCommands,
          poiLayer: resultFirst[0].poiLayer,
          accessToken,
          refreshToken,
        })  
    } ) 
  } else {
    res.status(400).json("Username or password incorrect!")
  }
  })
}

module.exports.logoutPost = function (req,res) {
  const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.status(200).json("You logged out successfully.")
}

module.exports.authRefresh = function (req,res) {
  const { id,userAccessToken, userRefreshToken } = req.body
  con.query(`SELECT * FROM wt_users_token WHERE userID="${id}" AND token="${userAccessToken}" AND refreshtoken="${userRefreshToken}"`, function (err, resultFirst, fields) {
    if (resultFirst){
    const accessToken = generateAccessToken(resultFirst)
    const refreshToken = generateRefreshToken(resultFirst)
    con.query(`SELECT * FROM wt_users WHERE id="${id}"`, function (err, resultSecond, fields) {
        res.setHeader('Content-Type', 'application/json')  
        res.json({
          isAdmin: resultSecond[0].administrator,
          id: resultSecond[0].id,
          attributes:resultSecond[0].attributes==="{}"? {}:resultSecond[0].attributes,
          name: resultSecond[0].name,
          login: resultSecond[0].login,
          email: resultSecond[0].email,
          phone: resultSecond[0].phone,
          readonly: resultSecond[0].readonly,
          map: resultSecond[0].map,
          latitude: resultSecond[0].latitude,
          longitude: resultSecond[0].longitude,
          zoom: resultSecond[0].zoom,
          lastscreen: resultSecond[0].lastscreen,
          twelveHourFormat:resultSecond[0].twelveHourFormat,
          coordinateFormat: resultSecond[0].coordinateFormat,
          disabled: resultSecond[0].disabled,
          expirationTime: resultSecond[0].expirationTime,
          deviceLimit: resultSecond[0].deviceLimit,
          userLimit: resultSecond[0].userLimit,
          deviceReadonly: resultSecond[0].deviceReadonly,
          limitCommands: resultSecond[0].limitCommands,
          poiLayer: resultSecond[0].poiLayer,
          accessToken,
          refreshToken,
        })
    } )
  } else {
    res.status(400).json("Username or password incorrect!")
  }
  })
}