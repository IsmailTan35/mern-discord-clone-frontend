import mongoose from 'mongoose'

var Schema = mongoose.Schema;

var userSchema = new Schema({
    nickname: {
        type: String,
        unique: true,
        required: [false, 'nickname is required'],
        minlength: [2, 'nickname can\'t be smaller than 2 characters'],
        maxlength: [64, 'nickname can\'t be greater than 64 characters']
    },
    firstName:{
        type:String,
        required:true
    },
    lastName: {
        type:String,
        required:true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    email : {
        type: String,
        index:true, 
        unique:true,
        sparse:true,
        required: [true, 'email is required'],
        minlength: [2, 'email can\'t be smaller than 2 characters'],
        maxlength: [64, 'email can\'t be greater than 64 characters']
    },
    token:Array,
});

export default mongoose.model('user', userSchema);