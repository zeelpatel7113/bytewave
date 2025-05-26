import mongoose from 'mongoose';

// Keep statusHistory schema with validation since it's admin-only
const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'interviewed', 'selected', 'rejected']
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

const careerSchema = new mongoose.Schema({
  requestId: String,
  name: String,
  email: String,
  phone: String,
  careerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerPosting',
  },
  experience: {
    type: String,
    default: ''  // Set default empty string for experience
  },
  resumeUrl: String,
  message: String,
  statusHistory: [statusHistorySchema]  // Keep statusHistory validation intact
}, {
  timestamps: true
});

const Career = mongoose.models.Career || mongoose.model('Career', careerSchema);

export default Career;