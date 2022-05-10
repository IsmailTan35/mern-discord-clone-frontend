import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var userSchema = new Schema({
    from: {
        type: String,
    },
    to:{
        type:Number
    },
    message: {
        type: String,
    },
});

export default mongoose.model('discordmessages', userSchema);