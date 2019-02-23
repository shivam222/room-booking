const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true,
        lowercase: true
    },
    user_count: {
        type:Number
    },
    room_count: {
        type:Number
    },
    room_names: {
        type:[String]
    }   
});

const org = module.exports = mongoose.model('org',userSchema);