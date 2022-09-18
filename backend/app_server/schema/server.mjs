import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var serverSchema = new Schema({
    servername: {
        type: String,
    },
	serverpicture: {
		type: String,
	},
    userIDs:{
        type:Array,
        unique: true
    },
    channels:{
        type:Array
    },
    inviteCode:{
        type:String,
        unique: true
    }
});

export default mongoose.model('discordserver', serverSchema);