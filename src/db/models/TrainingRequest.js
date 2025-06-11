import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected', 'completed'],
    default: 'draft'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
    trim: true,
    default: 'Bytewave Admin'
  }
}, { _id: false });

const trainingRequestSchema = new mongoose.Schema({
  requestId: {
    type: String,
    unique: true,
    trim: true
  },
  // Add submission ID field for deduplication
  submissionId: {
    type: String,
    index: true,
    sparse: true
  },
  name: {
    type: String,
    trim: true,
    default: ''
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: ''
  },
  phone: {
    type: String,
    trim: true,
    default: ''
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingCourse',
    default: null
  },
  experience: {
    type: String,
    trim: true,
    default: 'Not specified'
  },
  message: {
    type: String,
    trim: true,
    default: ''
  },
  statusHistory: {
    type: [statusHistorySchema],
    default: () => [{
      status: 'draft',
      notes: 'Initial request',
      updatedAt: new Date(),
      updatedBy: 'Bytewave Admin'
    }]
  }
}, {
  timestamps: true
});


const TrainingRequest = mongoose.models.TrainingRequest || mongoose.model('TrainingRequest', trainingRequestSchema);

export default TrainingRequest;