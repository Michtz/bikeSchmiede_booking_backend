import { Document, Schema, model } from 'mongoose';
import { Request } from 'express';

export interface BookingResponse {
  success: boolean;
  data?: IBookingDocument | IBookingDocument[] | null;
  error?: string;
}

interface IServiceSnapshot {
  name: string;
  price: number;
  durationMinutes: number;
}

interface IBikeSnapshot {
  brand: string;
  model: string;
  type?: string;
}

export type BookingType = 'booking' | 'blocker';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IBooking {
  bookingNumber: string;
  userId?: string;
  userEmail?: string;

  start: Date;
  end: Date;

  type: BookingType;
  status: BookingStatus;

  services: IServiceSnapshot[];
  bikeDetails?: IBikeSnapshot;

  customerNotes?: string;
  adminNotes?: string;

  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookingDocument extends IBooking, Document {}

export interface BookingRequest extends Request {
  params: {
    id?: string;
    bookingNumber?: string;
  };
  body: {
    start?: Date;
    end?: Date;
    services?: IServiceSnapshot[];
    userId?: string;
    adminNotes?: string;
    status?: BookingStatus;
    type?: BookingType;
  };
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

const serviceSnapshotSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
  },
  { _id: false },
);

const bikeSnapshotSchema = new Schema(
  {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: String },
  },
  { _id: false },
);

const bookingSchema = new Schema<IBookingDocument>(
  {
    bookingNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: String,
      index: true,
    },
    userEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },
    start: {
      type: Date,
      required: true,
      index: true,
    },
    end: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      enum: ['booking', 'blocker'],
      default: 'booking',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    services: [serviceSnapshotSchema],
    bikeDetails: bikeSnapshotSchema,

    customerNotes: String,
    adminNotes: String,

    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

bookingSchema.pre('validate', function (this: IBookingDocument, next) {
  if (this.isNew && !this.bookingNumber) {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(1000 + Math.random() * 9000);
    this.bookingNumber = `BK-${date}-${random}`;
  }
  next();
});

bookingSchema.index({ start: 1, end: 1 });

export const Booking = model<IBookingDocument>('Booking', bookingSchema);
