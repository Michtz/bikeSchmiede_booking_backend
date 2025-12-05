import { Router, Request, Response } from 'express';
import * as BookingController from '../controllers/booking.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { BookingRequest } from '../models/booking.model';

const router = Router();

// Public
router
  .route('/availability')
  .get((req: Request, res: Response) =>
    BookingController.getAvailability(req as BookingRequest, res),
  );

router
  .route('/')
  .post((req: Request, res: Response) =>
    BookingController.createBooking(req as BookingRequest, res),
  );

// User
router
  .route('/me')
  .get(authenticate, (req: Request, res: Response) =>
    BookingController.getUserBookings(req as BookingRequest, res),
  );

router
  .route('/:id/cancel')
  .patch(authenticate, (req: Request, res: Response) =>
    BookingController.cancelBooking(req as BookingRequest, res),
  );

// Admin
router
  .route('/admin')
  .get(authenticate, authorize(['admin']), (req: Request, res: Response) =>
    BookingController.getAllBookings(req as BookingRequest, res),
  );

router
  .route('/admin/block')
  .post(authenticate, authorize(['admin']), (req: Request, res: Response) =>
    BookingController.createBlocker(req as BookingRequest, res),
  );

router
  .route('/admin/:id/status')
  .patch(authenticate, authorize(['admin']), (req: Request, res: Response) =>
    BookingController.updateBookingStatus(req as BookingRequest, res),
  );

router
  .route('/admin/:id/notes')
  .patch(authenticate, authorize(['admin']), (req: Request, res: Response) =>
    BookingController.updateAdminNotes(req as BookingRequest, res),
  );

export default router;
