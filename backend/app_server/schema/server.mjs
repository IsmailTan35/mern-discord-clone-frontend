import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var serverSchema = new Schema({
    servername: {
        type: String,
        require:true

    },
	serverpicture: {
		type: String,
	},
    userIDs:{
        type:Array,
    },
    channels:{
        type:Array
    },
    inviteCode:{
        type:String,
        unique: true
    },
    timestamps: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('discordserver', serverSchema);