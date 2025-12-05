import { Response } from 'express';
import {
  BookingRequest,
  BookingStatus,
  BookingType,
} from '../models/booking.model';
import * as BookingService from '../services/booking.service';

export const getAvailability = async (
  req: BookingRequest,
  res: Response,
): Promise<void> => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({
        success: false,
        error: 'Date range (from, to) is required',
      });
      return;
    }

    const result = await BookingService.getAvailability(
      new Date(from as string),
      new Date(to as string),
    );

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching availability',
    });
  }
};

export const createBooking = async (
  req: BookingRequest,
  res: Response,
): Promise<void> => {
  try {
    const bookingData = req.body;
    const userId = req.user?.id;

    // If logged in, attach user ID
    if (userId) {
      bookingData.userId = userId;
    }

    const result = await BookingService.createBooking(bookingData);
    const status = result.success ? 201 : 400;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while creating booking',
    });
  }
};

export const getUserBookings = async (
  req: BookingRequest,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, error: 'Unauthorized' });
      return;
    }

    const result = await BookingService.getUserBookings(userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching bookings',
    });
  }
};

export const cancelBooking = async (
  req: BookingRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';

    if (!id) {
      res.status(400).json({ success: false, error: 'Booking ID required' });
      return;
    }

    const result = await BookingService.cancelBooking(id, userId, isAdmin);
    const status = result.success ? 200 : 403;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while cancelling booking',
    });
  }
};

export const getAllBookings = async (
  req: BookingRequest,
  res: Response,
): Promise<void> => {
  try {
    const { from, to, status } = req.query;
    const filters: any = {};

    if (from && to) {
      filters.start = { $gte: new Date(from as string) };
      filters.end = { $lte: new Date(to as string) };
    }

    if (status) {
      filters.status = status;
    }

    const result = await BookingService.getAllBookings(filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while fetching all bookings',
    });
  }
};

export const createBlocker = async (
  req: BookingRequest,
  res: Response,
): Promise<void> => {
  try {
    const blockerData = {
      ...req.body,
      type: 'blocker' as BookingType,
      status: 'confirmed' as BookingStatus,
    };
    const result = await BookingService.createBooking(blockerData);
    const status = result.success ? 201 : 400;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while creating blocker',
    });
  }
};

export const updateBookingStatus = async (
  req: BookingRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({ success: false, error: 'Status required' });
      return;
    }

    const result = await BookingService.updateBookingStatus(id!, status);
    const code = result.success ? 200 : 400;
    res.status(code).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while updating status',
    });
  }
};

export const updateAdminNotes = async (
  req: BookingRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const result = await BookingService.updateAdminNotes(id!, adminNotes);
    const code = result.success ? 200 : 400;
    res.status(code).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error while updating notes',
    });
  }
};
