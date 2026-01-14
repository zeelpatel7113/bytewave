import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true
  },
  subtitle: {
    type: String,
    trim: true,
    required: true
  },
  author: {
    type: String,
    trim: true,
    required: true
  },
  content: {
    type: String,
    trim: true,
    required: true
  },
  imageUrl: {
    type: String,
    trim: true,
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

export default Blog;
