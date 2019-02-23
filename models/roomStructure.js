const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    org: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    name: {
        type:String,
        required:true,
        lowercase: true
    },
    bookings: {
        type: Object 
    }
});

const room = module.exports = mongoose.model('room', userSchema);