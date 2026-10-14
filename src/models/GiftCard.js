import mongoose from 'mongoose';
import crypto from 'crypto';

const giftCardSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      default: () => 'SOBO-GIFT-' + crypto.randomBytes(3).toString('hex').toUpperCase(),
    },
    denomination: {
      type: Number,
      required: true,
      min: 500,
    },
    balance: {
      type: Number,
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    recipientEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    senderName: {
      type: String,
      required: true,
    },
    senderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    message: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'redeemed', 'expired'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('GiftCard', giftCardSchema);
