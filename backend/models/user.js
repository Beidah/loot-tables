const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String,
  },
  admin: {
    default: false,
    type: Boolean
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Users', userSchema);