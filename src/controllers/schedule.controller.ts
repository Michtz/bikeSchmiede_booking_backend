import { Response } from 'express';
import { ScheduleRequest } from '../models/schedule.model';
import * as ScheduleService from '../services/schedule.service';

export const getAllSchedules = async (
  req: ScheduleRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await ScheduleService.getAllSchedules();
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const getScheduleById = async (
  req: ScheduleRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ScheduleService.getScheduleById(id!);
    const status = result.success ? 200 : 404;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const createSchedule = async (
  req: ScheduleRequest,
  res: Response,
): Promise<void> => {
  try {
    const result = await ScheduleService.createSchedule(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const updateSchedule = async (
  req: ScheduleRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ScheduleService.updateSchedule(id!, req.body);
    const status = result.success ? 200 : 404;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const deleteSchedule = async (
  req: ScheduleRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ScheduleService.deleteSchedule(id!);
    const status = result.success ? 200 : 404;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

export const setActiveSchedule = async (
  req: ScheduleRequest,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await ScheduleService.setActiveSchedule(id!);
    const status = result.success ? 200 : 404;
    res.status(status).json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};
