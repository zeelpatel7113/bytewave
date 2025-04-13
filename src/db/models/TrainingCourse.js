import mongoose from 'mongoose';

const trainingCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  duration: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: String,
    required: true,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  syllabus: {
    type: String,
    required: true,
    trim: true,
  },
  prerequisites: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: String,
    default: () => new Date().toISOString().slice(0, 19).replace('T', ' ')
  },
  lastModified: {
    type: String,
    default: () => new Date().toISOString().slice(0, 19).replace('T', ' ')
  }
});

// Pre-save middleware to update lastModified
trainingCourseSchema.pre('save', function(next) {
  this.lastModified = new Date().toISOString().slice(0, 19).replace('T', ' ');
  next();
});

const TrainingCourse = mongoose.models.TrainingCourse || mongoose.model('TrainingCourse', trainingCourseSchema);

export default TrainingCourse;