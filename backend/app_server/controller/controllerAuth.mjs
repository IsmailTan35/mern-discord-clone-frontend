
import { generateAccessToken } from "../helper/helperToken.mjs"
import { generateRefreshToken } from "../helper/helperToken.mjs"
import userSchema from '../schema/user.mjs'
import crypto  from 'crypto'

const loginPost = async (req,res)=> {
  let data = req.body
  var user = await userSchema.find({
      email:data.email,
      password:data.password,
      googleAuth:false
  }).exec();
  if(user.length==1){
      res.status(200).json([
          {type:"name",value:user[0].name},
          {type:"surname",value:user[0].surname},
          {type:"email",value:user[0].email},
          {type:"nickname",value:user[0].nickname},
          {type:"token",value:user[0]._id},
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

const registerPost = () => {
  let data = req.body
  if(Object.values(data).length<6) return res.status(400).send({error:"no data"})
  var user = new userSchema({ 
      firstName:data.firstName,
      lastName:data.lastName,
      email: data.email,
      password: crypto.createHash('md5').update(data.confirmPassword).digest('hex'),
      nickname: data.nickname,
      profileType: data.profileType,
      lookingFor: data.lookingFor,
      token:[],
      googleAuth:false,
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