import mongoose from 'mongoose';

const doctorAssociationSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hospitalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  departments: [{
    type: String,
    required: true
  }],
  consultationFee: {
    type: Number,
    required: true,
    min: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure a doctor can only have one association per hospital
doctorAssociationSchema.index({ doctorId: 1, hospitalId: 1 }, { unique: true });

export default mongoose.model('DoctorAssociation', doctorAssociationSchema);