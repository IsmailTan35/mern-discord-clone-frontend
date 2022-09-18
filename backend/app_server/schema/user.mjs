import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true
    },
    code:{
        type:Number
    },
    password: {
        type: String,
    },
    email : {
        type: String,
        unique: true
    },
    state: {
        type: String,
    },
    servers:Array,
    friends:Array,
    blocked:Array,
    request:Array,
    token:Array,
});

export default mongoose.model('discorduser', userSchema);