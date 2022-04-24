import jwt from "jsonwebtoken"

const verifyPost = (req,res,next) => {
  const token = req.body.userAccessToken
  const refreshToken = req.body.userRefreshToken
  if (token && refreshToken) {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, userToken) => {
      if (err) {
        return res.status(403).json("Token is not valid!")
      }
      req.userToken = userToken
      jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, userRefreshToken) => {
        if (err) {
          return res.status(403).json("Token is not valid!")
        }
        req.userRefreshToken = userRefreshToken
        next()
      })
    })
  } else {
    res.status(401).json("You are not authenticated!")
  }
}

export {
  verifyPost
}