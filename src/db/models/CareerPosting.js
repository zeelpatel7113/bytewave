import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  skill: {
    type: String,
    trim: true
  }
}, { _id: false });

const careerPostingSchema = new mongoose.Schema({
  careerType: {
    type: String,
    trim: true,
    required: true
  },
  position: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: ['senior', 'mid-senior', 'mid', 'entry-level', 'intern'],
    trim: true
  },
  coreSkills: [skillSchema],
  projectType: {
    type: String,
    required: true,
    enum: ['full-time', 'contract', 'part-time', 'internship'],
    trim: true
  },
  jobLocation: {
    type: String,
    required: true,
    enum: ['remote', 'hybrid', 'onsite'],
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual field for human-readable experience level
careerPostingSchema.virtual('experienceRange').get(function() {
  const ranges = {
    'senior': '7+ years',
    'mid-senior': '4-7 years',
    'mid': '2-4 years',
    'entry-level': '1 year',
    'intern': 'No experience required'
  };
  return ranges[this.experienceLevel] || this.experienceLevel;
});

const CareerPosting = mongoose.models.CareerPosting || mongoose.model('CareerPosting', careerPostingSchema);

export default CareerPosting;