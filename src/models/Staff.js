import mongoose from 'mongoose';

const staffSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Staff name is required'],
      trim: true,
    },
    role: {
      type: String,
      default: 'Senior Nail Artist',
    },
    bio: {
      type: String,
      default: '',
    },
    avatar: {
      type: String,
      default: '',
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: '',
    },
    specialties: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
      },
    ],
    assignedLocations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SalonLocation',
      },
    ],
    workingHours: {
      start: { type: String, default: '10:00' },
      end: { type: String, default: '19:00' },
    },
    breaks: [
      {
        start: String,
        end: String,
      },
    ],
    daysOff: [
      {
        type: String, // e.g. "Tuesday"
      },
    ],
    experienceYears: {
      type: Number,
      default: 3,
    },
    featured: {
      type: Boolean,
      default: true,
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

export default mongoose.model('Staff', staffSchema);
