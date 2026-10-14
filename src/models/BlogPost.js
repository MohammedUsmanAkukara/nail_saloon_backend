import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    excerpt: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: 'Nail Care & Tips',
    },
    tags: [String],
    readTime: {
      type: String,
      default: '4 min read',
    },
    author: {
      name: { type: String, default: 'The Salon Editorial Team' },
      role: { type: String, default: 'Creative Director' },
      avatar: { type: String, default: '' },
    },
    published: {
      type: Boolean,
      default: true,
    },
    publishedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

blogPostSchema.index({ slug: 1, published: 1, publishedAt: -1 });

export default mongoose.model('BlogPost', blogPostSchema);
