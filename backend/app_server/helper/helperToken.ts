import  jwt from 'jsonwebtoken'

const generateAccessToken = (user: { id?: any; isAdmin?: any; }) =>{
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "process.env.ACCESS_TOKEN_SECRET", {
        expiresIn: "999days",
    })
}

const generateRefreshToken = (user: { id: any; isAdmin: any }) =>{
    return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "process.env.REFRESH_TOKEN_SECRET", {
        expiresIn: "10m",
    })
}

export {
    generateAccessToken,
    generateRefreshToken
}