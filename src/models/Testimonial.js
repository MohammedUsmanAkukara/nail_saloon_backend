import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    reviewText: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    locationName: {
      type: String,
      default: 'Bandra West, Mumbai',
    },
    serviceName: {
      type: String,
      default: 'Custom Gel Art & Extensions',
    },
    verified: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    approved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

testimonialSchema.index({ approved: 1, featured: 1 });

export default mongoose.model('Testimonial', testimonialSchema);
