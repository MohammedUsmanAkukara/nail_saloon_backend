import mongoose from 'mongoose';

const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['Minimal', 'French Tips', 'Chrome', 'Floral', 'Bridal', 'Glitter', '3D Art', 'Seasonal Trends'],
      required: true,
    },
    tags: [String],
    featured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

galleryImageSchema.index({ category: 1, featured: 1, active: 1 });

export default mongoose.model('GalleryImage', galleryImageSchema);
