import { Response } from 'express';
import { ServiceRequest } from '../models/service.model';
import * as ServiceService from '../services/service.service';

export const getAllServices = async (
  req: ServiceRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await ServiceService.getAllServices();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error fetching services',
    });
  }
};

export const createService = async (
  req: ServiceRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await ServiceService.createService(req.body);
    const status = result.success ? 201 : 400;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error creating service',
    });
  }
};

export const updateService = async (
  req: ServiceRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ServiceService.updateService(id!, req.body);
    const status = result.success ? 200 : 404;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error updating service',
    });
  }
};

export const deleteService = async (
  req: ServiceRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ServiceService.deleteService(id!);
    const status = result.success ? 200 : 404;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server error deleting service',
    });
  }
};
