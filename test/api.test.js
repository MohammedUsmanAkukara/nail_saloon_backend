import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { seedDatabase } from '../scripts/seedDatabase.js';
import SalonLocation from '../src/models/SalonLocation.js';
import Service from '../src/models/Service.js';
import Staff from '../src/models/Staff.js';
import Appointment from '../src/models/Appointment.js';
import { calculateAvailability } from '../src/services/availabilityService.js';

describe('The Sobo Salon Backend & Availability Tests', () => {
  before(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
    await seedDatabase({ quiet: true });
  });

  after(async () => {
    await disconnectDB();
  });

  test('Database is properly seeded with locations, services, and staff', async () => {
    const locCount = await SalonLocation.countDocuments();
    const serviceCount = await Service.countDocuments();
    const staffCount = await Staff.countDocuments();

    assert.ok(locCount >= 3, 'Should have at least 3 salon locations');
    assert.ok(serviceCount >= 5, 'Should have at least 5 nail services');
    assert.ok(staffCount >= 3, 'Should have at least 3 staff members');
  });

  test('calculateAvailability generates valid slots for future dates', async () => {
    const location = await SalonLocation.findOne({ slug: 'bandra-west' });
    const service = await Service.findOne({ slug: 'sculpted-gel-extensions' });

    // Pick a future date (e.g. 7 days from now)
    const futureDate = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

    const availability = await calculateAvailability({
      salonLocationId: location._id,
      date: futureDate,
      serviceIds: [service._id],
    });

    assert.strictEqual(availability.available, true);
    assert.ok(availability.slots.length > 0, 'Should have open time slots');
    assert.ok(availability.slots.includes('11:00'), 'Should include 11:00 slot');
  });

  test('calculateAvailability respects existing bookings and prevents collision', async () => {
    const location = await SalonLocation.findOne({ slug: 'bandra-west' });
    const service = await Service.findOne({ slug: 'glazed-chrome-gel' });
    const staff = await Staff.findOne({ name: 'Maya Sengupta' });

    const targetDate = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];

    // Create a confirmed appointment from 12:00 to 13:00 with Maya
    await Appointment.create({
      bookingReference: 'TEST-COLLISION-1',
      customer: { fullName: 'Test User', email: 'test@example.com', phone: '9999999999' },
      salonLocation: location._id,
      services: [{ service: service._id, name: service.name, price: service.basePrice, duration: 60 }],
      staff: staff._id,
      appointmentDate: targetDate,
      startTime: '12:00',
      endTime: '13:00',
      totalDuration: 60,
      totalPrice: service.basePrice,
      status: 'confirmed',
    });

    // Check availability for Maya specifically on that date
    const availability = await calculateAvailability({
      salonLocationId: location._id,
      date: targetDate,
      serviceIds: [service._id],
      staffId: staff._id,
    });

    // 12:00 and 12:30 must not be available for Maya!
    assert.strictEqual(availability.slots.includes('12:00'), false, '12:00 must be blocked for Maya');
    assert.strictEqual(availability.slots.includes('12:30'), false, '12:30 must be blocked for Maya');
  });
});
