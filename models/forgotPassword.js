const mongoose = require('mongoose');

const forgotPasswordSchema = mongoose.Schema({
_id: {
      type: Number
},
email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
},
password: {
      salt: {
            type: String,
            required: true
      },
      passwordHash: {
            type: String,
            required: true
      }
},
storeTime: {
      type: Date,
      required: true
}
});

const forgotPassword = module.exports = mongoose.model('forgotPassword', forgotPasswordSchema);