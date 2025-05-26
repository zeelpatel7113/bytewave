import mongoose from 'mongoose';

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ['draft', 'pending', 'followup1', 'followup2', 'approved', 'rejected', 'completed']
  },
  notes: {
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

const trainingRequestSchema = new mongoose.Schema({
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
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingCourse',
  },
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
  },
  message: {
    type: String,
    trim: true,
  },
  statusHistory: [statusHistorySchema]
}, {
  timestamps: true
});


const TrainingRequest = mongoose.models.TrainingRequest || mongoose.model('TrainingRequest', trainingRequestSchema);

export default TrainingRequest;

// Client-side request creation
// const newRequest = new TrainingRequest({
//   name: 'John Doe',
//   email: 'john@example.com',
//   phone: '1234567890',
//   courseId: courseObjectId,
//   experience: 'beginner',
//   message: 'Interested in this course'
// });

// // Admin-side: Populate course details when fetching
// const request = await TrainingRequest
//   .findOne({ requestId: 'TR-001' })
//   .populate('courseId', 'title'); // This will give you the course name