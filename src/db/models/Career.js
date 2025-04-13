import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
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
  position: {
    type: String,
    trim: true,
  },
  experience: {
    type: Number,
  },
  resumeUrl: {
    type: String,
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interviewed', 'selected', 'rejected'],
    default: 'pending',
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
  },
});

const Career = mongoose.models.Career || mongoose.model('Career', careerSchema);

export default Career;