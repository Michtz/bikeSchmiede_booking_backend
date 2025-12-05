import { Service, ServiceResponse, IService } from '../models/service.model';

export const getAllServices = async (): Promise<ServiceResponse> => {
  try {
    const services = await Service.find({ isActive: true });
    return { success: true, data: services };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const createService = async (
  data: Partial<IService>,
): Promise<ServiceResponse> => {
  try {
    const service = await Service.create(data);
    return { success: true, data: service };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const updateService = async (
  id: string,
  data: Partial<IService>,
): Promise<ServiceResponse> => {
  try {
    const service = await Service.findByIdAndUpdate(id, data, { new: true });
    if (!service) return { success: false, error: 'Service not found' };
    return { success: true, data: service };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

export const deleteService = async (id: string): Promise<ServiceResponse> => {
  try {
    // Soft delete
    const service = await Service.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true },
    );
    if (!service) return { success: false, error: 'Service not found' };
    return { success: true, data: service };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};
