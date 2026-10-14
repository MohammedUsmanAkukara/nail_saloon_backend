import mongoose from 'mongoose';
import crypto from 'crypto';

const appointmentServiceItemSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const appointmentSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    cancellationToken: {
      type: String,
      default: () => crypto.randomBytes(24).toString('hex'),
      index: true,
    },
    customer: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      notes: { type: String, default: '' },
    },
    salonLocation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SalonLocation',
      required: true,
      index: true,
    },
    services: [appointmentServiceItemSchema],
    staff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Staff',
      default: null,
      index: true,
    },
    appointmentDate: {
      type: String, // format YYYY-MM-DD
      required: true,
      index: true,
    },
    startTime: {
      type: String, // HH:MM in 24hr format
      required: true,
    },
    endTime: {
      type: String, // HH:MM in 24hr format
      required: true,
    },
    totalDuration: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
      default: 'confirmed',
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'deposit_paid', 'refunded'],
      default: 'unpaid',
    },
    customerNotes: {
      type: String,
      default: '',
    },
    internalNotes: {
      type: String,
      default: '',
    },
    cancellationReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for slot checking efficiency
appointmentSchema.index({ salonLocation: 1, appointmentDate: 1, status: 1 });
appointmentSchema.index({ staff: 1, appointmentDate: 1, status: 1 });

export default mongoose.model('Appointment', appointmentSchema);
