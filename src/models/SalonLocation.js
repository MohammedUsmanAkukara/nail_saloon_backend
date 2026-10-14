import mongoose from 'mongoose';

const openingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    open: {
      type: String,
      default: '10:00 AM',
    },
    close: {
      type: String,
      default: '08:00 PM',
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const salonLocationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Salon name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: '',
    },
    openingHours: [openingHourSchema],
    holidays: [
      {
        date: String,
        reason: String,
      },
    ],
    coordinates: {
      lat: { type: Number, default: 18.922 },
      lng: { type: Number, default: 72.834 },
    },
    mapEmbedUrl: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    galleryImages: [String],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

salonLocationSchema.index({ slug: 1, city: 1, active: 1 });

export default mongoose.model('SalonLocation', salonLocationSchema);
