import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    trim: true,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'resolved', 'archived'],
    default: 'new',
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedAt: String,
    updatedBy: String,
  }],
  createdAt: {
    type: String,
    required: true,
  }
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;