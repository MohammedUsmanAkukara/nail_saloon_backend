import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    announcement: {
      text: { type: String, default: 'Your next nail obsession starts here. Complimentary champagne with bridal sets.' },
      enabled: { type: Boolean, default: true },
      link: { type: String, default: '/book' },
    },
    hero: {
      headline: { type: String, default: 'Your Nails.\nYour Art.\nYour Moment.' },
      subheadline: { type: String, default: 'Discover exceptional nail artistry, bespoke gel extensions, thoughtful care, and a little everyday luxury.' },
      primaryCtaText: { type: String, default: 'Book Your Appointment' },
      secondaryCtaText: { type: String, default: 'Explore Our Services' },
      heroImage: { type: String, default: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80' },
      badgeText: { type: String, default: 'NAIL SALON & SPA EXPERIENCE • MUMBAI & BEYOND' },
    },
    aboutSection: {
      eyebrow: { type: String, default: 'THE ART OF SOPHISTICATION' },
      heading: { type: String, default: 'Beauty in Every Detail.' },
      story1: { type: String, default: 'At Nail Salon & Spa, we view nail care not as routine maintenance, but as high fashion, personal identity, and quiet luxury.' },
      story2: { type: String, default: 'Our master nail technicians combine cutting-edge Japanese and Russian dry manicure techniques with non-toxic, salon-grade gel systems that nourish natural nails.' },
      signatureQuote: { type: String, default: 'Crafted for connoisseurs of meticulous perfection.' },
    },
    contactInfo: {
      phone: { type: String, default: '+91 (022) 2640-8901' },
      email: { type: String, default: 'concierge@nailsalonandspa.com' },
      whatsappNumber: { type: String, default: '919876543210' },
      headquartersAddress: { type: String, default: 'Pali Hill, Bandra West, Mumbai 400050' },
      businessHours: { type: String, default: 'Mon - Sun: 10:00 AM – 08:30 PM' },
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com' },
      facebook: { type: String, default: 'https://facebook.com' },
      pinterest: { type: String, default: 'https://pinterest.com' },
    },
    bookingRules: {
      slotIntervalMinutes: { type: Number, default: 30 },
      advanceBookingDays: { type: Number, default: 30 },
      cancellationNoticeHours: { type: Number, default: 4 },
      currency: { type: String, default: 'INR' },
      currencySymbol: { type: String, default: '₹' },
    },
    seo: {
      siteTitle: { type: String, default: 'Nail Salon & Spa | Luxury Nail Art & Manicure Studio' },
      metaDescription: { type: String, default: 'Boutique nail salon offering bespoke gel nail extensions, bridal nail art, luxury manicures, and pedicures in Bandra, Colaba, and Indiranagar.' },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
