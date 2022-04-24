import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
    },
    code:{
        type:Number
    },
    password: {
        type: String,
    },
    email : {
        type: String,
    },
    state: {
        type: String,
    },
    friends:Array,
    blocked:Array,
    request:Array,
    token:Array,
});

export default mongoose.model('discorduser', userSchema);