import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema({
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
    required: true,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected'],
    default: 'draft'
  },
  notes: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date().toISOString().slice(0, 19).replace('T', ' ')
  },
  lastModified: {
    type: Date,
    default: () => new Date().toISOString().slice(0, 19).replace('T', ' ')
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: {
      type: Date,
      default: () => new Date().toISOString().slice(0, 19).replace('T', ' ')
    },
    updatedBy: String
  }]
});

// Pre-save middleware to update lastModified
serviceRequestSchema.pre('save', function(next) {
  this.lastModified = new Date().toISOString().slice(0, 19).replace('T', ' ');
  next();
});

const ServiceRequest = mongoose.models.ServiceRequest || mongoose.model('ServiceRequest', serviceRequestSchema);

export default ServiceRequest;