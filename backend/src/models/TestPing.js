const mongoose = require('mongoose');

const TestPingSchema = new mongoose.Schema(
  {
    test: { type: String, default: 'ping' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('TestPing', TestPingSchema);
