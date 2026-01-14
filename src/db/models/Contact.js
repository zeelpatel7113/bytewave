import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected']
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

const contactSchema = new mongoose.Schema({
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
  message: {
    type: String,
    trim: true,
  },
  date: {
    type: String,
    trim: true
  },
  statusHistory: [statusHistorySchema]
}, {
  timestamps: true
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;