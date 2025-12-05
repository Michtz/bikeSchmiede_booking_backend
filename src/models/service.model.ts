import { Document, Schema, model } from 'mongoose';
import { Request } from 'express';

export interface ServiceResponse {
  success: boolean;
  data?: IServiceDocument | IServiceDocument[] | null;
  error?: string;
}

export interface IService {
  name: string;
  description?: string;
  price: number;
  durationCustomerMinutes: number;
  durationTotalMinutes: number;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
}

export interface IServiceDocument extends IService, Document {}

export interface ServiceRequest extends Request {
  params: {
    id?: string;
  };
  body: {
    name?: string;
    description?: string;
    price?: number;
    durationCustomerMinutes?: number;
    durationTotalMinutes?: number;
    category?: string;
    imageUrl?: string;
    isActive?: boolean;
  };
  user?: {
    id: string;
    email: string;
    role?: string;
  };
}

const serviceSchema = new Schema<IServiceDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    durationCustomerMinutes: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    durationTotalMinutes: {
      type: Number,
      required: true,
      min: 0,
      default: 60,
    },
    category: {
      type: String,
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Service = model<IServiceDocument>('Service', serviceSchema);
