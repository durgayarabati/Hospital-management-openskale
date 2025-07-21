import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['hospital_admin', 'doctor', 'patient'],
    required: true
  },
  // Doctor specific fields
  qualifications: [{
    type: String
  }],
  specializations: [{
    type: String
  }],
  experience: {
    type: Number,
    min: 0
  },
  // Patient specific fields
  gender: {
    type: String,
    enum: ['male', 'female', 'other']
  },
  dateOfBirth: Date,
  uniqueId: String, // Aadhar, Passport, etc.
  // Associations
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital'
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);