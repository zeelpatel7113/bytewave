import mongoose from 'mongoose';

const trainingRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'TrainingCourse',
  },
  courseName: {
    type: String,
    required: true,
    trim: true,
  },
  preferredSchedule: {
    type: String,
    required: true,
    enum: ['weekday-morning', 'weekday-evening', 'weekend-morning', 'weekend-evening'],
  },
  experience: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  message: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending',
  },
  statusHistory: [{
    status: {
      type: String,
      required: true,
      enum: ['pending', 'approved', 'rejected', 'completed'],
    },
    note: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: String,
      required: true,
    },
    updatedBy: {
      type: String,
      required: true,
    },
  }],
  createdAt: {
    type: String,
    required: true,
  },
  lastModified: {
    type: String,
    required: true,
  },
});

const TrainingRequest = mongoose.models.TrainingRequest || mongoose.model('TrainingRequest', trainingRequestSchema);

export default TrainingRequest;