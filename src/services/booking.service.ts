import { Booking, BookingResponse, IBooking } from '../models/booking.model';
import { Schedule } from '../models/schedule.model';

export const getAvailability = async (
  start: Date,
  end: Date,
): Promise<{ success: boolean; data?: Date[]; error?: string }> => {
  try {
    const schedule = await Schedule.findOne({
      isActive: true,
      validFrom: { $lte: start },
      $or: [{ validUntil: { $gte: end } }, { validUntil: null }],
    });

    if (!schedule) {
      return { success: false, error: 'No active schedule found' };
    }

    const bookings = await Booking.find({
      status: { $ne: 'cancelled' },
      start: { $lt: end },
      end: { $gt: start },
    });

    const availableSlots: Date[] = [];
    const slotDuration = schedule.slotDurationMinutes * 60000;
    let currentDay = new Date(start);

    // Iterate through days
    while (currentDay <= end) {
      const dayName = currentDay
        .toLocaleDateString('en-US', { weekday: 'long' })
        .toLowerCase();
      const daySlots = (schedule.openingHours as any)[dayName] || [];

      // Generate slots for the day
      for (const timeSlot of daySlots) {
        const [hStart, mStart] = timeSlot.start.split(':').map(Number);
        const [hEnd, mEnd] = timeSlot.end.split(':').map(Number);

        let slotTime = new Date(currentDay);
        slotTime.setHours(hStart, mStart, 0, 0);

        const endTime = new Date(currentDay);
        endTime.setHours(hEnd, mEnd, 0, 0);

        while (slotTime.getTime() + slotDuration <= endTime.getTime()) {
          const slotEnd = new Date(slotTime.getTime() + slotDuration);

          // Check collision
          const isBusy = bookings.some(
            (b) => b.start < slotEnd && b.end > slotTime,
          );

          if (!isBusy) {
            availableSlots.push(new Date(slotTime));
          }

          slotTime = new Date(slotTime.getTime() + slotDuration);
        }
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }

    return { success: true, data: availableSlots };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const createBooking = async (
  data: Partial<IBooking>,
): Promise<BookingResponse> => {
  try {
    // 1. Calculate price and duration from services if provided
    let calculatedPrice = 0;
    let totalDurationMinutes = 0;
    const snapshotServices = [];

    if (data.services && data.services.length > 0) {
      // Logic: assuming frontend sends simplified objects or IDs,
      // but here we expect snapshots or full data.
      // Ideally, fetch real services from DB to ensure price integrity
      // For now, using provided data but in production verify IDs
      for (const svc of data.services) {
        calculatedPrice += svc.price;
        totalDurationMinutes += svc.durationMinutes;
        snapshotServices.push(svc);
      }
    }

    if (data.totalPrice === undefined) {
      data.totalPrice = calculatedPrice;
    }

    // 2. Validate End Time if not provided
    if (!data.end && data.start && totalDurationMinutes > 0) {
      data.end = new Date(
        new Date(data.start).getTime() + totalDurationMinutes * 60000,
      );
    }

    if (!data.start || !data.end) {
      return { success: false, error: 'Start and End time required' };
    }

    // 3. Double-check availability (Race Condition prevention)
    const conflict = await Booking.findOne({
      status: { $ne: 'cancelled' },
      start: { $lt: data.end },
      end: { $gt: data.start },
    });

    if (conflict) {
      return { success: false, error: 'Slot already taken' };
    }

    const booking = await Booking.create(data);
    return { success: true, data: booking };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getUserBookings = async (
  userId: string,
): Promise<BookingResponse> => {
  try {
    const bookings = await Booking.find({ userId }).sort({ start: 1 });
    return { success: true, data: bookings };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getAllBookings = async (filter: any): Promise<BookingResponse> => {
  try {
    const bookings = await Booking.find(filter)
      .populate('userId', 'firstName lastName email')
      .sort({ start: 1 });
    return { success: true, data: bookings };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const cancelBooking = async (
  bookingId: string,
  userId: string | undefined,
  isAdmin: boolean,
): Promise<BookingResponse> => {
  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return { success: false, error: 'Booking not found' };
    }

    if (!isAdmin && booking.userId?.toString() !== userId) {
      return { success: false, error: 'Not authorized to cancel this booking' };
    }

    booking.status = 'cancelled';
    await booking.save();

    return { success: true, data: booking };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const updateBookingStatus = async (
  id: string,
  status: any,
): Promise<BookingResponse> => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!booking) return { success: false, error: 'Booking not found' };
    return { success: true, data: booking };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const updateAdminNotes = async (
  id: string,
  notes: string,
): Promise<BookingResponse> => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { adminNotes: notes },
      { new: true },
    );
    if (!booking) return { success: false, error: 'Booking not found' };
    return { success: true, data: booking };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
