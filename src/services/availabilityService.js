import SalonLocation from '../models/SalonLocation.js';
import Service from '../models/Service.js';
import Staff from '../models/Staff.js';
import Appointment from '../models/Appointment.js';

// Helper to convert "HH:MM" (or "10:00 AM") string to minutes from midnight
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const str = timeStr.trim();

  // If 12-hour format with AM/PM
  const match12 = str.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (match12) {
    let hours = parseInt(match12[1], 10);
    const minutes = parseInt(match12[2], 10);
    const modifier = match12[3] ? match12[3].toUpperCase() : null;

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  }

  // If simple "HH:MM"
  const [h, m] = str.split(':').map((num) => parseInt(num, 10));
  return (h || 0) * 60 + (m || 0);
};

// Helper to convert minutes from midnight to "HH:MM"
export const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// Returns day of week name from "YYYY-MM-DD"
export const getDayName = (dateStr) => {
  const parts = dateStr.split('-');
  const dateObj = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dateObj.getUTCDay()];
};

export const calculateAvailability = async ({
  salonLocationId,
  date, // "YYYY-MM-DD"
  serviceIds = [],
  staffId = null,
}) => {
  const location = await SalonLocation.findById(salonLocationId);
  if (!location || !location.active) {
    throw new Error('Salon location not found or is currently inactive.');
  }

  // Check holiday/closure
  const isHoliday = location.holidays?.some((h) => h.date === date);
  if (isHoliday) {
    return {
      date,
      available: false,
      reason: 'The salon is closed on this date for a scheduled holiday.',
      slots: [],
    };
  }

  // Get day of week
  const dayName = getDayName(date);
  const daySchedule = location.openingHours?.find((h) => h.day === dayName);

  if (!daySchedule || daySchedule.isClosed) {
    return {
      date,
      available: false,
      reason: `The salon is closed on ${dayName}s.`,
      slots: [],
    };
  }

  // Calculate total service duration
  const services = await Service.find({ _id: { $in: serviceIds }, active: true });
  if (services.length === 0) {
    throw new Error('Please select at least one valid service.');
  }
  const totalDuration = services.reduce((acc, curr) => acc + (curr.duration || 45), 0);

  const salonOpenMin = timeToMinutes(daySchedule.open || '10:00');
  const salonCloseMin = timeToMinutes(daySchedule.close || '20:00');

  // Fetch all active staff assigned to this salon
  let staffList = await Staff.find({
    assignedLocations: salonLocationId,
    active: true,
  });

  if (staffId) {
    staffList = staffList.filter((s) => s._id.toString() === staffId.toString());
    if (staffList.length === 0) {
      return {
        date,
        available: false,
        reason: 'Selected artist is not available at this salon.',
        slots: [],
      };
    }
  }

  if (staffList.length === 0) {
    return {
      date,
      available: false,
      reason: 'No nail technicians are currently scheduled at this location.',
      slots: [],
    };
  }

  // Fetch all existing booked appointments on this date for this location
  const existingAppointments = await Appointment.find({
    salonLocation: salonLocationId,
    appointmentDate: date,
    status: { $in: ['pending', 'confirmed'] },
  });

  // Check if date is today and calculate minimum allowable start time
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const isToday = date === todayStr;
  const currentMinutesNow = now.getHours() * 60 + now.getMinutes() + 30; // 30 min buffer

  const interval = 30; // 30 min slots
  const availableSlots = [];

  for (let slotStart = salonOpenMin; slotStart + totalDuration <= salonCloseMin; slotStart += interval) {
    // If today, cannot book past times
    if (isToday && slotStart < currentMinutesNow) {
      continue;
    }

    const slotEnd = slotStart + totalDuration;

    // Check if at least one staff member is free for this duration
    let isSlotAvailable = false;

    for (const member of staffList) {
      // Check if day is member's day off
      if (member.daysOff?.includes(dayName)) {
        continue;
      }

      // Check member's working hours
      const staffStart = timeToMinutes(member.workingHours?.start || '10:00');
      const staffEnd = timeToMinutes(member.workingHours?.end || '19:00');

      if (slotStart < staffStart || slotEnd > staffEnd) {
        continue;
      }

      // Check breaks
      const hasBreakCollision = member.breaks?.some((b) => {
        const bStart = timeToMinutes(b.start);
        const bEnd = timeToMinutes(b.end);
        return Math.max(slotStart, bStart) < Math.min(slotEnd, bEnd);
      });
      if (hasBreakCollision) continue;

      // Check collision with staff's existing appointments
      const hasApptCollision = existingAppointments.some((appt) => {
        if (!appt.staff) return false;
        if (appt.staff.toString() !== member._id.toString()) return false;

        const apptStart = timeToMinutes(appt.startTime);
        const apptEnd = timeToMinutes(appt.endTime);
        return Math.max(slotStart, apptStart) < Math.min(slotEnd, apptEnd);
      });

      if (!hasApptCollision) {
        // Staff member is free!
        isSlotAvailable = true;
        break;
      }
    }

    // If no specific staff was requested, also ensure total overlapping appointments doesn't exceed total salon capacity
    if (!staffId && isSlotAvailable) {
      const overlappingCount = existingAppointments.filter((appt) => {
        const apptStart = timeToMinutes(appt.startTime);
        const apptEnd = timeToMinutes(appt.endTime);
        return Math.max(slotStart, apptStart) < Math.min(slotEnd, apptEnd);
      }).length;

      if (overlappingCount >= staffList.length) {
        isSlotAvailable = false;
      }
    }

    if (isSlotAvailable) {
      availableSlots.push(minutesToTime(slotStart));
    }
  }

  return {
    date,
    dayName,
    available: availableSlots.length > 0,
    totalDuration,
    salonHours: {
      open: daySchedule.open,
      close: daySchedule.close,
    },
    slots: availableSlots,
  };
};
