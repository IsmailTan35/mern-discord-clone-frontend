import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var userSchema = new Schema({
    sender: {
        type: String,
    },
    receiver:{
        type:String
    },
    message: {
        type: String,
    },
    serverName: {
        type: String,
        default:null
    },
    channelName: {
        type: String,
        default:null
    },
    timestamps: {
        type: Date,
        default: Date.now,
    },
    
});

export default mongoose.model('discordmessages', userSchema);