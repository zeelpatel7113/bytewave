import mongoose from 'mongoose';

const learningPointSchema = new mongoose.Schema({
  point: {
    type: String,
    trim: true,
  }
}, { _id: false });

const trainingCourseSchema = new mongoose.Schema({
  trainingId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  overview: {
    type: String,
    trim: true,
  },
  whatYouWillLearn: {
    type: [learningPointSchema],
    validate: {
      validator: function(points) {
        return !points.length || points.length <= 4; // Allow empty array and maximum 4 points
      },
      message: 'Learning points cannot exceed 4 items'
    },
    default: [] // Added default empty array
  },
  courseStructure: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Ensure proper JSON formatting


const TrainingCourse = mongoose.models.TrainingCourse || mongoose.model('TrainingCourse', trainingCourseSchema);

export default TrainingCourse;