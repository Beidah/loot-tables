const mongoose = require('mongoose');

const tablesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  events: [
    {
      weight: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        required: true,
      }
    }
  ],
  description: String,
  private: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Table', tablesSchema, "tables");