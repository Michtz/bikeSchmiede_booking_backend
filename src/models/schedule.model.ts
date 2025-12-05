import { Document, Schema, model } from 'mongoose';
import { Request } from 'express';

export interface ScheduleResponse {
  success: boolean;
  data?: IScheduleDocument | IScheduleDocument[] | null;
  error?: string;
}

interface ITimeSlot {
  start: string;
  end: string;
}

interface IWeekProfile {
  monday: ITimeSlot[];
  tuesday: ITimeSlot[];
  wednesday: ITimeSlot[];
  thursday: ITimeSlot[];
  friday: ITimeSlot[];
  saturday: ITimeSlot[];
  sunday: ITimeSlot[];
}

export interface ISchedule {
  name: string;
  validFrom: Date;
  validUntil?: Date;
  isActive: boolean;
  slotDurationMinutes: number;
  openingHours: IWeekProfile;
}

export interface IScheduleDocument extends ISchedule, Document {}

export interface ScheduleRequest extends Request {
  params: {
    id?: string;
  };
  body: {
    name?: string;
    validFrom?: string | any;
    validUntil?: string;
    isActive?: boolean;
    slotDurationMinutes?: number;
    openingHours?: IWeekProfile;
  };
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

const timeSlotSchema = new Schema(
  {
    start: { type: String, required: true },
    end: { type: String, required: true },
  },
  { _id: false },
);

const weekProfileSchema = new Schema(
  {
    monday: [timeSlotSchema],
    tuesday: [timeSlotSchema],
    wednesday: [timeSlotSchema],
    thursday: [timeSlotSchema],
    friday: [timeSlotSchema],
    saturday: [timeSlotSchema],
    sunday: [timeSlotSchema],
  },
  { _id: false },
);

const scheduleSchema = new Schema<IScheduleDocument>(
  {
    name: { type: String, required: true },
    validFrom: { type: Date, required: true, index: true },
    validUntil: { type: Date },
    isActive: { type: Boolean, default: true },
    slotDurationMinutes: { type: Number, default: 60 },
    openingHours: {
      type: weekProfileSchema,
      default: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: [],
      },
    },
  },
  {
    timestamps: true,
  },
);

export const Schedule = model<IScheduleDocument>('Schedule', scheduleSchema);
