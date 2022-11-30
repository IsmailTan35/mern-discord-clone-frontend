

import express from 'express'
const app = express();

app.get("/",(req:any,res:any)=>{
    res.send("sadas")
})
app.listen(3000)