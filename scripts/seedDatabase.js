import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User from '../src/models/User.js';
import SalonLocation from '../src/models/SalonLocation.js';
import ServiceCategory from '../src/models/ServiceCategory.js';
import Service from '../src/models/Service.js';
import Staff from '../src/models/Staff.js';
import Appointment from '../src/models/Appointment.js';
import Customer from '../src/models/Customer.js';
import GalleryImage from '../src/models/GalleryImage.js';
import Testimonial from '../src/models/Testimonial.js';
import BlogPost from '../src/models/BlogPost.js';
import GiftCard from '../src/models/GiftCard.js';
import NewsletterSubscriber from '../src/models/NewsletterSubscriber.js';
import SiteSettings from '../src/models/SiteSettings.js';
import ContactEnquiry from '../src/models/ContactEnquiry.js';
import { connectDB } from '../src/config/db.js';

export const seedDatabase = async ({ quiet = false, onlyIfEmpty = false } = {}) => {
  if (onlyIfEmpty) {
    const existingServices = await Service.countDocuments();
    if (existingServices > 0) {
      if (!quiet) console.log('[Seeder] Database already populated. Skipping auto-seed.');
      return;
    }
  }

  if (!quiet) console.log('[Seeder] Seeding database with luxury salon demonstration data...');

  // 1. Clean collections
  await Promise.all([
    User.deleteMany({}),
    SalonLocation.deleteMany({}),
    ServiceCategory.deleteMany({}),
    Service.deleteMany({}),
    Staff.deleteMany({}),
    Appointment.deleteMany({}),
    Customer.deleteMany({}),
    GalleryImage.deleteMany({}),
    Testimonial.deleteMany({}),
    BlogPost.deleteMany({}),
    GiftCard.deleteMany({}),
    NewsletterSubscriber.deleteMany({}),
    SiteSettings.deleteMany({}),
    ContactEnquiry.deleteMany({}),
  ]);

  // 2. Locations
  const locations = await SalonLocation.create([
    {
      name: 'Nail Salon & Spa - Bandra West',
      slug: 'bandra-west',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: 'Plot 42, Pali Hill Road, Bandra West, Mumbai 400050',
      postalCode: '400050',
      phone: '+91 (022) 2640-8901',
      email: 'bandra@nailsalonandspa.com',
      coordinates: { lat: 19.0607, lng: 72.8258 },
      mapEmbedUrl: 'https://maps.google.com/maps?q=Bandra+West+Mumbai&t=&z=14&ie=UTF8&iwloc=&output=embed',
      coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
      ],
      openingHours: [
        { day: 'Monday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
        { day: 'Tuesday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
        { day: 'Wednesday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
        { day: 'Thursday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
        { day: 'Friday', open: '10:00 AM', close: '09:00 PM', isClosed: false },
        { day: 'Saturday', open: '10:00 AM', close: '09:00 PM', isClosed: false },
        { day: 'Sunday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
      ],
      active: true,
    },
    {
      name: 'Nail Salon & Spa - Colaba Heritage',
      slug: 'colaba-heritage',
      city: 'Mumbai',
      state: 'Maharashtra',
      address: '14 Apollo Bunder, Colaba, Mumbai 400001',
      postalCode: '400001',
      phone: '+91 (022) 2282-4110',
      email: 'colaba@nailsalonandspa.com',
      coordinates: { lat: 18.922, lng: 72.8347 },
      mapEmbedUrl: 'https://maps.google.com/maps?q=Colaba+Mumbai&t=&z=14&ie=UTF8&iwloc=&output=embed',
      coverImage: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      ],
      openingHours: [
        { day: 'Monday', open: '10:30 AM', close: '08:30 PM', isClosed: false },
        { day: 'Tuesday', open: '10:30 AM', close: '08:30 PM', isClosed: false },
        { day: 'Wednesday', open: '10:30 AM', close: '08:30 PM', isClosed: false },
        { day: 'Thursday', open: '10:30 AM', close: '08:30 PM', isClosed: false },
        { day: 'Friday', open: '10:30 AM', close: '09:00 PM', isClosed: false },
        { day: 'Saturday', open: '10:00 AM', close: '09:00 PM', isClosed: false },
        { day: 'Sunday', open: '10:00 AM', close: '08:00 PM', isClosed: false },
      ],
      active: true,
    },
    {
      name: 'Nail Salon & Spa - Indiranagar Studio',
      slug: 'indiranagar-bengaluru',
      city: 'Bengaluru',
      state: 'Karnataka',
      address: '772, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038',
      postalCode: '560038',
      phone: '+91 (080) 4124-7700',
      email: 'bengaluru@nailsalonandspa.com',
      coordinates: { lat: 12.9784, lng: 77.6408 },
      mapEmbedUrl: 'https://maps.google.com/maps?q=Indiranagar+100+Feet+Road+Bengaluru&t=&z=14&ie=UTF8&iwloc=&output=embed',
      coverImage: 'https://images.unsplash.com/photo-1582095133179-bfd08e2fc6b3?auto=format&fit=crop&w=1000&q=80',
      galleryImages: [],
      openingHours: [
        { day: 'Monday', open: '10:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Tuesday', open: '10:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Wednesday', open: '10:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Thursday', open: '10:00 AM', close: '08:00 PM', isClosed: false },
        { day: 'Friday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
        { day: 'Saturday', open: '10:00 AM', close: '08:30 PM', isClosed: false },
        { day: 'Sunday', open: '10:00 AM', close: '08:00 PM', isClosed: false },
      ],
      active: true,
    },
  ]);

  // 3. Admin Users
  await User.create([
    {
      name: 'Victoria Hastings',
      email: 'admin@nailsalonandspa.com',
      password: 'Password@123',
      role: 'superadmin',
      active: true,
    },
    {
      name: 'Pooja Kashyap',
      email: 'manager.bandra@nailsalonandspa.com',
      password: 'Password@123',
      role: 'manager',
      assignedLocations: [locations[0]._id],
      active: true,
    },
    {
      name: 'Simran Mehta',
      email: 'reception@nailsalonandspa.com',
      password: 'Password@123',
      role: 'receptionist',
      assignedLocations: [locations[0]._id, locations[1]._id],
      active: true,
    },
  ]);

  // 4. Categories
  const categories = await ServiceCategory.create([
    {
      name: 'Gel Nail Extensions',
      slug: 'gel-nail-extensions',
      description: 'Ultra-lightweight, non-damaging sculpting gel sculpted over forms or soft tips for timeless elegance.',
      image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80',
      sortOrder: 1,
    },
    {
      name: 'Acrylic Nail Extensions',
      slug: 'acrylic-nail-extensions',
      description: 'High-strength, bespoke extensions tailored in coffin, stiletto, almond, or classic square silhouettes.',
      image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=600&q=80',
      sortOrder: 2,
    },
    {
      name: 'Manicure & Russian Cuticle Care',
      slug: 'manicure-treatments',
      description: 'Dry hardware manicure technique delivering pristine, long-lasting cuticle precision and nourishing hydration.',
      image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80',
      sortOrder: 3,
    },
    {
      name: 'Signature Nail Art & Chrome',
      slug: 'nail-art-chrome',
      description: 'From understated glazed donut finishes to elaborate 3D hand-painted botanical masterpieces.',
      image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=600&q=80',
      sortOrder: 4,
    },
    {
      name: 'Luxury Pedicure Spa',
      slug: 'luxury-pedicure',
      description: 'Detoxifying thermal soaks, volcanic exfoliations, cuticle refinement, and deeply restorative massage.',
      image: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=600&q=80',
      sortOrder: 5,
    },
    {
      name: 'Refills & Care Add-ons',
      slug: 'refills-and-removals',
      description: 'Gentle soak-offs, structural rebalances, IBX nail repair therapy, and intensive collagen treatments.',
      image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=600&q=80',
      sortOrder: 6,
    },
  ]);

  // 5. Services
  const services = await Service.create([
    {
      name: 'Signature Sculpted Gel Extensions',
      slug: 'sculpted-gel-extensions',
      category: categories[0]._id,
      shortDescription: 'Bespoke hard-gel extensions sculpted on custom forms. Lightweight, ultra-durable, and natural-feeling.',
      fullDescription: 'Our signature gel extension service uses premium hypoallergenic European gels to sculpt customized extensions matching your natural nail bed curvature. Includes dry cuticle prep, length tailoring, shape contouring, and 2 coats of your choice of gel lacquer.',
      coverImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      galleryImages: [
        'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      ],
      duration: 90,
      basePrice: 3200,
      locationPricing: [
        { location: locations[0]._id, price: 3400 },
        { location: locations[1]._id, price: 3400 },
        { location: locations[2]._id, price: 3000 },
      ],
      featured: true,
      popular: true,
      includedHighlights: [
        'Russian dry cuticle technique',
        'Custom sculpting on forms',
        'Non-yellowing premium gel formulation',
        'Complimentary cuticle oil take-home vial',
      ],
      sortOrder: 1,
    },
    {
      name: 'Hailey Bieber Glazed Chrome Gel',
      slug: 'glazed-chrome-gel',
      category: categories[3]._id,
      shortDescription: 'The iconic pearlescent micro-chrome sheen over nude milk base with high-gloss mirror reflections.',
      fullDescription: 'Achieve the runway-famous glazed donut glow. We apply our proprietary sheer milky foundation, cure with precision LED, hand-buff ultrafine pearl chrome pigment, and seal with a double-coat flexi top layer for lasting luster.',
      coverImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      duration: 60,
      basePrice: 2200,
      locationPricing: [
        { location: locations[0]._id, price: 2400 },
      ],
      featured: true,
      popular: true,
      includedHighlights: [
        'Japanese gel prep',
        'Micro-fine champagne or pearl chrome buffing',
        'Non-peeling edge sealing',
      ],
      sortOrder: 2,
    },
    {
      name: 'Russian Dry Hardware Manicure',
      slug: 'russian-dry-manicure',
      category: categories[2]._id,
      shortDescription: 'Meticulous e-file diamond bit cuticle clean for surgical precision and cuticle health.',
      fullDescription: 'The pinnacle of hygienic nail care. Using sanitized medical-grade diamond burrs, our specialists gently exfoliate proximal fold keratin without water immersion. Allows gel colour to be painted beneath the cuticle line for an extra 2 weeks of growth invisibility.',
      coverImage: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
      duration: 60,
      basePrice: 1800,
      featured: true,
      popular: true,
      includedHighlights: [
        'Diamond e-file cuticle polishing',
        'Nail plate balancing',
        'Deep jojoba cuticle massage',
      ],
      sortOrder: 3,
    },
    {
      name: 'Editorial French Micro-Tips & Crystal Accent',
      slug: 'french-micro-tips',
      category: categories[3]._id,
      shortDescription: 'Razor-thin precision French smile lines accented with Swarovski micro-crystals or chrome trim.',
      fullDescription: 'A modern, high-fashion reimagining of the classic French manicure. Hand-painted micro-lines in burgundy, cream white, or metallic chrome create a clean, elongated illusion.',
      coverImage: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      duration: 75,
      basePrice: 2600,
      featured: true,
      includedHighlights: [
        'Hand-drawn micro smiles',
        'Swarovski elements placement',
        'High-gloss chip-resistant topcoat',
      ],
      sortOrder: 4,
    },
    {
      name: 'Bespoke 3D Jelly & Korean Glass Art',
      slug: '3d-jelly-korean-glass',
      category: categories[3]._id,
      shortDescription: 'Translucent syrup bases, dimensional water droplets, metallic wire art, and cat-eye prisms.',
      fullDescription: 'Expressive contemporary nail artistry inspired by Seoul and Tokyo fashion scenes. Includes gradient syrup gel layering, dimensional embossed structures, and magnet-aligned cat-eye velvet finishes.',
      coverImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      duration: 90,
      basePrice: 3500,
      featured: false,
      popular: true,
      includedHighlights: [
        'Syrup gradient technique',
        'High-viscosity 3D sculpting gel',
        'Customized per client request',
      ],
      sortOrder: 5,
    },
    {
      name: 'Luxury Rose Quartz Thermal Pedicure',
      slug: 'rose-quartz-thermal-pedicure',
      category: categories[4]._id,
      shortDescription: 'Herbal Himalayan salt soak, rosehip seed exfoliation, heated booties, and hot stone massage.',
      fullDescription: 'An immersive 75-minute foot sanctuary. Begins with a foot bath infused with organic rose essential oils and Himalayan pink salt, followed by gentle callus smoothing, heated rose quartz massage, and long-lasting gel polish application.',
      coverImage: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80',
      duration: 75,
      basePrice: 2800,
      featured: true,
      includedHighlights: [
        'Himalayan salt soak',
        'Rosehip oil exfoliator',
        'Warm rose quartz stone therapy',
        'Gel lacquer on toes',
      ],
      sortOrder: 6,
    },
    {
      name: 'Acrylic Full Set with Almond Shape',
      slug: 'acrylic-full-set-almond',
      category: categories[1]._id,
      shortDescription: 'Classic high-strength acrylic application sculpted with tapered almond or ballerina contouring.',
      fullDescription: 'Ideal for clients seeking dramatic length, exceptional resilience, and crisp symmetry. Applied using low-odor EMA monomers and fine cosmetic polymers.',
      coverImage: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80',
      duration: 90,
      basePrice: 2900,
      featured: false,
      sortOrder: 7,
    },
    {
      name: 'IBX Natural Nail Strengthening & Gel Rebalance',
      slug: 'ibx-repair-and-refill',
      category: categories[5]._id,
      shortDescription: 'Targeted penetrative nail plate repair for peeling nails combined with 3-week gel rebalance.',
      fullDescription: 'IBX penetrates into the upper layers of the nail plate through heat activation, fusing damaged keratin layers together from within before replenishing regrowth at the cuticle bed.',
      coverImage: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      duration: 60,
      basePrice: 2000,
      featured: false,
      sortOrder: 8,
    },
  ]);

  // 6. Staff
  const staff = await Staff.create([
    {
      name: 'Maya Sengupta',
      role: 'Master Nail Artist & Creative Director',
      bio: 'Trained at the Tokyo Nail Academy with over 8 years creating editorial sets for Vogue and high-fashion brides.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      email: 'maya@nailsalonandspa.com',
      phone: '+91 98201 12345',
      specialties: [services[0]._id, services[1]._id, services[4]._id],
      assignedLocations: [locations[0]._id, locations[1]._id],
      workingHours: { start: '10:00', end: '19:00' },
      experienceYears: 8,
      featured: true,
      active: true,
    },
    {
      name: 'Chloe D’Souza',
      role: 'Senior Japanese Gel Specialist',
      bio: 'Known for razor-sharp micro-French tips, flawless chrome finishes, and meticulous Russian dry manicure craft.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
      email: 'chloe@nailsalonandspa.com',
      phone: '+91 98202 67890',
      specialties: [services[1]._id, services[2]._id, services[3]._id],
      assignedLocations: [locations[0]._id],
      workingHours: { start: '11:00', end: '20:00' },
      experienceYears: 5,
      featured: true,
      active: true,
    },
    {
      name: 'Ananya Verma',
      role: 'Lead 3D & Bridal Nail Artist',
      bio: 'Celebrated for delicate pearl embellishments, cat-eye prisms, and customized bespoke wedding nail concepts.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
      email: 'ananya@nailsalonandspa.com',
      phone: '+91 98203 11223',
      specialties: [services[0]._id, services[4]._id, services[5]._id],
      assignedLocations: [locations[1]._id, locations[2]._id],
      workingHours: { start: '10:00', end: '19:00' },
      experienceYears: 6,
      featured: true,
      active: true,
    },
    {
      name: 'Zara Alvi',
      role: 'Sculpting & Thermal Spa Specialist',
      bio: 'Expert in non-toxic gel extensions, natural nail recovery therapies, and soothing holistic foot rituals.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      email: 'zara@nailsalonandspa.com',
      phone: '+91 98204 33445',
      specialties: [services[2]._id, services[5]._id, services[6]._id],
      assignedLocations: [locations[0]._id, locations[2]._id],
      workingHours: { start: '10:00', end: '19:00' },
      experienceYears: 4,
      featured: true,
      active: true,
    },
  ]);

  // 7. Gallery Images
  await GalleryImage.create([
    {
      title: 'Minimalist Milky Nude & Gold Accent',
      description: 'Understated editorial sheer base with 24K gold foil flakes on almond shape.',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80',
      category: 'Minimal',
      featured: true,
      sortOrder: 1,
    },
    {
      title: 'Deep Burgundy Micro French Line',
      description: 'Sleek Autumn burgundy precision French smile over warm ivory base.',
      imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80',
      category: 'French Tips',
      featured: true,
      sortOrder: 2,
    },
    {
      title: 'Glazed Pearl Oyster Chrome',
      description: 'High-gloss iridescent chrome buffed over sheer blush pink.',
      imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=800&q=80',
      category: 'Chrome',
      featured: true,
      sortOrder: 3,
    },
    {
      title: 'Hand-Painted Wildflowers & Petals',
      description: 'Delicate botanical watercolor illustrations on matte milk gel.',
      imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80',
      category: 'Floral',
      featured: true,
      sortOrder: 4,
    },
    {
      title: 'Bridal Champagne & Swarovski Dew',
      description: 'Soft champagne glitter ombré accented with genuine Swarovski micro stones.',
      imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80',
      category: 'Bridal',
      featured: true,
      sortOrder: 5,
    },
    {
      title: 'Korean Water Drop & 3D Glass',
      description: 'Dimensional sculpted clear drops with holographic shimmer reflections.',
      imageUrl: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&w=800&q=80',
      category: '3D Art',
      featured: true,
      sortOrder: 6,
    },
    {
      title: 'Velvet Cat-Eye Emerald Prism',
      description: 'Multi-angle magnetic velvet shimmer with dimensional jewel tones.',
      imageUrl: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?auto=format&fit=crop&w=800&q=80',
      category: 'Glitter',
      featured: false,
      sortOrder: 7,
    },
    {
      title: 'Tortoise Shell & Gold Foil Fusion',
      description: 'Layered amber and charcoal resin effect with burnished foil veins.',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80',
      category: 'Seasonal Trends',
      featured: false,
      sortOrder: 8,
    },
  ]);

  // 8. Testimonials
  await Testimonial.create([
    {
      customerName: 'Ayesha Mehra',
      rating: 5,
      reviewText: 'Nail Salon & Spa in Bandra is a revelation. The dry Russian manicure stayed completely immaculate for four full weeks without lifting or chipping. The studio feels like a Parisian editorial loft.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      locationName: 'Bandra West, Mumbai',
      serviceName: 'Sculpted Gel Extensions & Glazed Chrome',
      verified: true,
      featured: true,
      approved: true,
    },
    {
      customerName: 'Natasha Kapoor',
      rating: 5,
      reviewText: 'Maya Sengupta created my bespoke bridal set with champagne foil and pearls. The care, quiet luxury atmosphere, and hygiene standards surpass any salon in South Mumbai.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      locationName: 'Colaba Heritage, Mumbai',
      serviceName: 'Bridal Champagne & Swarovski Set',
      verified: true,
      featured: true,
      approved: true,
    },
    {
      customerName: 'Rhea Singhania',
      rating: 5,
      reviewText: 'Their thermal rose quartz pedicure was one of the most relaxing self-care experiences I’ve had all year. Booking online was effortless and the staff greeted me with infused herbal tea.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      locationName: 'Indiranagar Studio, Bengaluru',
      serviceName: 'Rose Quartz Thermal Pedicure',
      verified: true,
      featured: true,
      approved: true,
    },
    {
      customerName: 'Devika Shroff',
      rating: 5,
      reviewText: 'I have naturally fragile, paper-thin nails. Their IBX treatment combined with hard gel sculpting literally rescued my nail beds. Truly the pinnacle of nail artistry.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      locationName: 'Bandra West, Mumbai',
      serviceName: 'Russian Dry Manicure & IBX Care',
      verified: true,
      featured: true,
      approved: true,
    },
  ]);

  // 9. Blog Articles
  await BlogPost.create([
    {
      title: 'The Art of the Dry Manicure: Why Cuticle Health Comes First',
      slug: 'art-of-dry-manicure-cuticle-health',
      excerpt: 'Discover why traditional water soaks are being replaced by diamond e-file hardware techniques in luxury salons worldwide.',
      content: `### Why Water Soaks Expand the Natural Nail Plate
When natural nails are submerged in warm water before gel application, the keratin fibers absorb moisture and swell. Once polished and cured under LED light, the water gradually evaporates, causing the nail plate to shrink and contract—the primary reason for premature gel lifting and edge chipping.

### The Diamond E-File Revolution
Originating in Russia and perfected in Tokyo, the dry hardware manicure relies on sterilized, surgical diamond bits to gently lift and buff dead eponychium tissue without disturbing the living protective matrix.

### The Result: An Extra 14 Days of Perfection
Because the cuticle perimeter is cleanly prepared without jagged snipping, nail technicians can apply gel polish virtually beneath the proximal fold. As your nail grows out, the regrowth line remains crisp, smooth, and undetectable for up to a month.`,
      coverImage: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=1000&q=80',
      category: 'Nail Care & Health',
      tags: ['Dry Manicure', 'Cuticle Health', 'Russian Technique', 'Salon Secrets'],
      readTime: '4 min read',
      author: {
        name: 'Maya Sengupta',
        role: 'Master Nail Artist & Creative Director',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      },
      published: true,
      publishedAt: new Date(),
    },
    {
      title: 'Autumn Rose & Chrome: Defining Nail Aesthetics in 2026',
      slug: 'autumn-rose-and-chrome-trends-2026',
      excerpt: 'From subdued champagne dust to mirror burgundy velvet, explore the palette defining this season’s editorial runways.',
      content: `### High-Gloss Restraint
This season moves away from chaotic neon maximalism toward intentional, tailored quiet luxury. Think ultra-fine translucent jelly bases in dusty rose, paired with warm ivory and micro-thin metallic framing.

### The Micro-French Evolution
Rather than wide 90s tip blocks, 2026 embraces the razor micro-line. Painted with a specialized 000-detailer brush, this technique subtly elongates short and medium length natural nails.

### Chrome As An Everyday Neutral
Chrome is no longer reserved for nightlife. Our clients wear frosted pearl oyster and champagne dust to boardroom meetings and gala dinners alike.`,
      coverImage: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=1000&q=80',
      category: 'Trend Report',
      tags: ['Chrome Nails', 'Editorial Trends', 'Autumn Palette', 'Quiet Luxury'],
      readTime: '5 min read',
      author: {
        name: 'Chloe D’Souza',
        role: 'Senior Japanese Gel Specialist',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      },
      published: true,
      publishedAt: new Date(Date.now() - 86400000 * 3),
    },
    {
      title: 'Gel vs. Acrylic: Choosing the Perfect Extension For Your Lifestyle',
      slug: 'gel-vs-acrylic-extensions-guide',
      excerpt: 'Everything you need to know about flexibility, durability, removal protocols, and natural nail health.',
      content: `### Understanding the Chemical Composition
Both gel and acrylic belong to the acrylate family, but their polymer cross-linking differs significantly. Hard sculpting gel maintains elastomeric flexibility, while acrylic sets into a rigid structural matrix.

### Who Should Choose Sculpted Hard Gel?
If you have flexible, thin natural nails or spend extensive time typing and in water, hard gel absorbs everyday kinetic shocks without breaking or damaging the underlying nail bed.

### Who Should Choose Classic Acrylic?
Clients who adore dramatic lengths (extra-long coffins or stilettos) or experience habitual thumb/index pressure often appreciate the unyielding strength of EMA cosmetic acrylic.`,
      coverImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1000&q=80',
      category: 'Technique & Lore',
      tags: ['Gel Extensions', 'Acrylic', 'Nail Guide', 'Consultation'],
      readTime: '6 min read',
      author: {
        name: 'Victoria Hastings',
        role: 'Founder & Creative Director',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      },
      published: true,
      publishedAt: new Date(Date.now() - 86400000 * 7),
    },
  ]);

  // 10. Sample Appointments
  const todayStr = new Date().toISOString().split('T')[0];
  await Appointment.create([
    {
      bookingReference: 'SOBO-DEMO-A101',
      customer: {
        fullName: 'Kavita Choksi',
        email: 'kavita.choksi@example.com',
        phone: '+91 98200 99887',
      },
      salonLocation: locations[0]._id,
      services: [
        {
          service: services[0]._id,
          name: services[0].name,
          price: 3400,
          duration: 90,
        },
      ],
      staff: staff[0]._id,
      appointmentDate: todayStr,
      startTime: '14:00',
      endTime: '15:30',
      totalDuration: 90,
      totalPrice: 3400,
      status: 'confirmed',
      paymentStatus: 'paid',
      customerNotes: 'Prefers square-oval shape with minimal cuticle oil scent.',
    },
    {
      bookingReference: 'SOBO-DEMO-B202',
      customer: {
        fullName: 'Tara Varma',
        email: 'tara.varma@example.com',
        phone: '+91 98211 44556',
      },
      salonLocation: locations[0]._id,
      services: [
        {
          service: services[1]._id,
          name: services[1].name,
          price: 2400,
          duration: 60,
        },
      ],
      staff: staff[1]._id,
      appointmentDate: todayStr,
      startTime: '16:00',
      endTime: '17:00',
      totalDuration: 60,
      totalPrice: 2400,
      status: 'confirmed',
      paymentStatus: 'unpaid',
      customerNotes: 'Glazed chrome with soft champagne shimmer.',
    },
  ]);

  // 11. Gift Cards
  await GiftCard.create([
    {
      code: 'SOBO-GIFT-LUX100',
      denomination: 5000,
      balance: 5000,
      recipientName: 'Meera Rajput',
      recipientEmail: 'meera.rajput@example.com',
      senderName: 'Sanjay Rajput',
      senderEmail: 'sanjay.rajput@example.com',
      message: 'Happy Anniversary my love! Treat yourself to a bespoke salon afternoon.',
      status: 'active',
    },
    {
      code: 'SOBO-GIFT-VAL250',
      denomination: 2500,
      balance: 1000,
      recipientName: 'Priya Nambiar',
      recipientEmail: 'priya.n@example.com',
      senderName: 'Ananya S.',
      senderEmail: 'ananya@example.com',
      message: 'Congratulations on your graduation!',
      status: 'active',
    },
  ]);

  // 12. SiteSettings
  await SiteSettings.create({
    announcement: {
      text: 'Your next nail obsession starts here. Complimentary organic rose tea with every appointment.',
      enabled: true,
      link: '/book',
    },
    hero: {
      headline: 'Your Nails.\nYour Art.\nYour Moment.',
      subheadline: 'Discover exceptional nail artistry, bespoke gel extensions, thoughtful cuticle care, and a little everyday luxury.',
      primaryCtaText: 'Book Your Appointment',
      secondaryCtaText: 'Explore Our Services',
      heroImage: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=1200&q=80',
      badgeText: 'NAIL SALON & SPA EXPERIENCE • MUMBAI & BENGALURU',
    },
  });

  if (!quiet) console.log('[Seeder] Database seeding completed successfully!');
};

// If run directly from CLI
if (process.argv[1]?.endsWith('seedDatabase.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase({ quiet: false });
      process.exit(0);
    } catch (e) {
      console.error('[Seeder] Error seeding database:', e);
      process.exit(1);
    }
  })();
}
