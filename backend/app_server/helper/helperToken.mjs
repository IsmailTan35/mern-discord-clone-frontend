import  jwt from 'jsonwebtoken'

const generateAccessToken = (user) =>{
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m",
    })
}

const generateRefreshToken = (user) =>{
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "10m",
    })
}

export {
    generateAccessToken,
    generateRefreshToken
}