
import { generateAccessToken } from "../helper/helperToken.mjs"
import { generateRefreshToken } from "../helper/helperToken.mjs"
import userSchema from '../schema/user.mjs'
import crypto  from 'crypto'
import {UniqueId,UniqueName} from "../helper/helperGetUniqueID.mjs";

const loginPost = async (req,res)=> {
  let data = req.body
  const token =generateAccessToken({}) 

  const filter = { 
    email: data.email, 
    password:crypto.createHash('md5').update(data.password).digest('hex') 
  };
  
  const update = { 
    $push: { 
      token
    } 
  }
  console.log(token)
  var user = await userSchema.findOneAndUpdate(filter,update)
  if(user){
      res.status(200).json([
          {type:"username",value:user.username},
          {type:"email",value:user.email},
          {type:"code",value:user.code},
          {type:"friends",value:user.friends},
          {type:"blocked",value:user.blocked},
          {type:"request",value:user.request},
          {type:"token",value:token},
      ])
  }
  else{
      res.status(401).json("login failed")
  }
}

const logoutPost = (req,res) =>{
  const refreshToken = req.body.token
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
    res.status(200).json("You logged out successfully.")
}

const authRefresh = (req,res) => {
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
          refreshToken,
        })
    } )
  } else {
    res.status(400).json("Username or password incorrect!")
  }
  })
}

const registerPost = (req,res) => {
  let data = req.body
  if(Object.values(data).length<3) return res.status(400).send({error:"no data"})
  var user = new userSchema({ 
    username: data.username,
      email: data.email,
      password: crypto.createHash('md5').update(data.password).digest('hex'),
      code:UniqueId(),
      friends: [],
      blocked: [],
      request: [],
      state: "offline",
      token:[],
  });
  user.save((err, user)=> {
    err ? res.status(401).json("not registered"):res.status(200).json("registered")
  });
}

export {
  loginPost,
  logoutPost,
  registerPost
}