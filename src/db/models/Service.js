import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  imageUrl: {
    type: String,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

serviceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);

export default Service;