const mongoose = require('mongoose');

const tablesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Users',
  },
  table: [
    {
      weight: {
        type: Number,
        required: true,
      },
      event: {
        type: String,
        required: true,
      }
    }
  ],
  private: {
    type: Boolean,
    default: false,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Tables', tablesSchema);