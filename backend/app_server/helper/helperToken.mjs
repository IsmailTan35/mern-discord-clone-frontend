const jwt = require('jsonwebtoken')

module.exports.generateAccessToken = function(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
    })
}

module.exports.generateRefreshToken = function(user) {
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10m",
    })
}