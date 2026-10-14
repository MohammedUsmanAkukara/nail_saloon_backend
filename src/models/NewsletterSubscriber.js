import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
    },
    active: {
      type: Boolean,
      default: true,
    },
    source: {
      type: String,
      default: 'website_footer',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('NewsletterSubscriber', subscriberSchema);
