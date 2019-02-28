const mongoose = require('mongoose');

const pendingUserSchema = mongoose.Schema({
      _id: {
         type: Number
      },
      org: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
      },
      name: {
            type: String,
            required: true,
            trim: true
      },
      email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
      },
      role: {
            type: String,
            required: true,
            enum: ['admin', 'booker', 'looker'],
            default: "booker"
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

const pendingUser = module.exports = mongoose.model('pendingUser', pendingUserSchema);