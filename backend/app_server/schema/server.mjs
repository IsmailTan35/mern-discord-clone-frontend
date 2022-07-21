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
        type:Array
    },
    channels:{
        type:Array
    },
    inviteCode:{
        type:String
    }
});

export default mongoose.model('discordserver', serverSchema);