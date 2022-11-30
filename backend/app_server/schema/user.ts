import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {
        type: String,
        unique: true,
        require:true
    },
    code:{
        type:Number,
        require:true

    },
    password: {
        type: String,
        require:true

    },
    email : {
        type: String,
        unique: true,
        require:true

    },
    state: {
        type: String,
    },
    servers:Array,
    friends:Array,
    blocked:Array,
    request:Array,
    token:Array,
    timestamps: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('discorduser', userSchema);