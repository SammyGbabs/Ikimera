const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imagePath: {
    type: String,
    required: true
  },
  imageUrl: String,
  notes: {
    type: String,
    trim: true
  },
  diagnosis: {
    disease: String,
    confidence: Number,
    severity: {
      type: String,
      enum: ['healthy', 'warning', 'infected'],
      default: 'healthy'
    },
    recommendations: [String]
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  cropType: String,
  weather: {
    temperature: Number,
    humidity: Number,
    conditions: String,
    timestamp: Date
  },
  processed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Upload', uploadSchema);