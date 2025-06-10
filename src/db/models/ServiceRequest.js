import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['partial','draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected']
  },
  note: {
    type: String,
    trim: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    trim: true
  }
}, { _id: false });

const serviceRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    trim: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    trim: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: false
  },
  message: {
    type: String,
    trim: true,
  },
  statusHistory: [statusHistorySchema]
}, {
  timestamps: true
});

const ServiceRequest = mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;