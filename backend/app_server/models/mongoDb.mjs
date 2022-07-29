import mongoose from 'mongoose'
const email = process.env.EMAIL || "ismail"
const password = process.env.PASSWORD  || "rdhXhqyMAI2c6nE6"
const cluster = process.env.CLUSTER || "cluster0"
const uri = `mongodb+srv://${email}:${password}@${cluster}.xlfsl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const mongoDb = async () =>{
  const con = mongoose.connection

  mongoose.connection.on('connecting', () => {
    console.log('connecting to mongodb')
  })

  mongoose.connection.on('connected', () => {
    console.log('connected to mongodb')
  })

  mongoose.connection.on('disconnecting', () => {
    console.log('disconnecting to mongodb')
  })

  mongoose.connection.on('disconnected', () => {
    console.log('disconnected to mongodb')
  })
  
  mongoose.connection.on('error', ()=>{
    console.error('connection error:')
    
    mongoose.disconnect()

    setTimeout(()=>{
      mongoose.connect(uri)
        .catch(err => console.log("hata"));;
    },5000)
  })

  mongoose.connection.on('reconnected',()=>{
    console.log('reconnected to Mongodb')
  })

  mongoose.connect(uri)
    .catch(err => console.log("hata"));;

  return con
}
export default mongoDb;