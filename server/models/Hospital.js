import mongoose from 'mongoose';

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  departments: [{
    name: {
      type: String,
      required: true
    },
    description: String
  }],
  totalRevenue: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.model('Hospital', hospitalSchema);