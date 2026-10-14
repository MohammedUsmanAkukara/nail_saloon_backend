import mongoose from 'mongoose';

const locationPriceSchema = new mongoose.Schema(
  {
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalonLocation',
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceCategory',
      required: [true, 'Service category is required'],
    },
    shortDescription: {
      type: String,
      default: '',
    },
    fullDescription: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    galleryImages: [String],
    duration: {
      type: Number, // in minutes
      required: [true, 'Duration in minutes is required'],
      min: 5,
    },
    basePrice: {
      type: Number, // in INR
      required: [true, 'Base price is required'],
      min: 0,
    },
    locationPricing: [locationPriceSchema],
    featured: {
      type: Boolean,
      default: false,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    includedHighlights: [String],
  },
  {
    timestamps: true,
  }
);

serviceSchema.index({ slug: 1, category: 1, active: 1, featured: 1 });

export default mongoose.model('Service', serviceSchema);
