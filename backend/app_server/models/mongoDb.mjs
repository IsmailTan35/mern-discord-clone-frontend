import mongoose from 'mongoose'
const email = process.env.EMAIL || "ismail"
const password = process.env.PASSWORD  || "rdhXhqyMAI2c6nE6"
const cluster = process.env.CLUSTER || "cluster0"
const uri = `mongodb+srv://${email}:${password}@${cluster}.xlfsl.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const mongoDb = async () =>{
  const con = mongoose.connection

  mongoose.connection.on('connecting', () => {
    console.info('connecting to mongodb')
  })

  mongoose.connection.on('connected', () => {
    console.info('connected to mongodb')
  })

  mongoose.connection.on('disconnecting', () => {
    console.warn('disconnecting to mongodb')
  })

  mongoose.connection.on('disconnected', () => {
    console.warn('disconnected to mongodb')
  })
  
  mongoose.connection.on('error', ()=>{
    console.error('connection error:')
    
    mongoose.disconnect()

    setTimeout(()=>{
      mongoose.connect(uri)
        .catch(err => console.error("hata"));;
    },5000)
  })

  mongoose.connection.on('reconnected',()=>{
    console.info('reconnected to Mongodb')
  })

  mongoose.connect(uri)
    .catch(err => console.error("hata"));;

  return con
}
export default mongoDb;