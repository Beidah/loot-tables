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
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

userSchema.virtual('tables', {
  ref: "Table",
  localField: '_id',
  foreignField: 'user',
})

module.exports = mongoose.model('User', userSchema, "users");