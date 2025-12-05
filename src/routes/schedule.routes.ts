import { Router, Request, Response } from 'express';
import * as ScheduleController from '../controllers/schedule.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { ScheduleRequest } from '../models/schedule.model';

const router = Router();

// Admin only
router.use(authenticate, authorize(['admin']));

router
  .route('/')
  .get((req: Request, res: Response) =>
    ScheduleController.getAllSchedules(req as ScheduleRequest, res),
  )
  .post((req: Request, res: Response) =>
    ScheduleController.createSchedule(req as ScheduleRequest, res),
  );

router
  .route('/:id')
  .get((req: Request, res: Response) =>
    ScheduleController.getScheduleById(req as ScheduleRequest, res),
  )
  .put((req: Request, res: Response) =>
    ScheduleController.updateSchedule(req as ScheduleRequest, res),
  )
  .delete((req: Request, res: Response) =>
    ScheduleController.deleteSchedule(req as ScheduleRequest, res),
  );

router
  .route('/:id/activate')
  .patch((req: Request, res: Response) =>
    ScheduleController.setActiveSchedule(req as ScheduleRequest, res),
  );

export default router;
