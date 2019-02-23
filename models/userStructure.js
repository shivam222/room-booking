const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
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
      }
});

const user = module.exports = mongoose.model('user', userSchema);