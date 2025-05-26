import mongoose from 'mongoose';

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
  careerId: { // Reference to admin-managed career posting
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CareerPosting',
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
  statusHistory: [statusHistorySchema]
}, {
  timestamps: true
});

const Career = mongoose.models.Career || mongoose.model('Career', careerSchema);

export default Career;