import {
  Schedule,
  ScheduleResponse,
  ISchedule,
} from '../models/schedule.model';

export const getAllSchedules = async (): Promise<ScheduleResponse> => {
  try {
    const schedules = await Schedule.find().sort({ validFrom: -1 });
    return { success: true, data: schedules };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const getScheduleById = async (
  id: string,
): Promise<ScheduleResponse> => {
  try {
    const schedule = await Schedule.findById(id);
    if (!schedule) return { success: false, error: 'Schedule not found' };
    return { success: true, data: schedule };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const createSchedule = async (
  data: Partial<ISchedule | any>,
): Promise<ScheduleResponse> => {
  try {
    const schedule = await Schedule.create(data);
    return { success: true, data: schedule };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const updateSchedule = async (
  id: string,
  data: Partial<ISchedule | any>,
): Promise<ScheduleResponse> => {
  try {
    const schedule = await Schedule.findByIdAndUpdate(id, data, { new: true });
    if (!schedule) return { success: false, error: 'Schedule not found' };
    return { success: true, data: schedule };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const deleteSchedule = async (id: string): Promise<ScheduleResponse> => {
  try {
    const schedule = await Schedule.findByIdAndDelete(id);
    if (!schedule) return { success: false, error: 'Schedule not found' };
    return { success: true, data: schedule };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const setActiveSchedule = async (
  id: string,
): Promise<ScheduleResponse> => {
  try {
    // Disable all others first (simplified logic)
    await Schedule.updateMany({}, { isActive: false });

    const schedule = await Schedule.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true },
    );

    if (!schedule) return { success: false, error: 'Schedule not found' };
    return { success: true, data: schedule };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
