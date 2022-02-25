import mongoose from 'mongoose'
const uri = "mongodb+srv://discord:0DxyUM7oM2G4ah7z@discord.xlfsl.mongodb.net/Test?retryWrites=true&w=majority";

async function mongoDb() {
  await mongoose.connect(uri);
  const MyModel = mongoose.model('Test', new Schema({ name: String }));
}
export default mongoDb;