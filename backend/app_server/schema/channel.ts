import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var channelSchema = new Schema({
    channelname: {
        type: String,
    },
	channeltype: {
		type: String,
	},
    serverID:{
        type:String
    },
	locked:{
		type:Array
	},
	group:{
		type:String
	},
	type:{
		type:String
	},
	onlineUser:{
		type:Array
	}

});

export default mongoose.model('discordchannel', channelSchema);