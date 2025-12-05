import { Router, Request, Response } from 'express';
import * as ServiceController from '../controllers/service.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { ServiceRequest } from '../models/service.model';

const router = Router();

// Public
router
  .route('/')
  .get((req: Request, res: Response) =>
    ServiceController.getAllServices(req as ServiceRequest, res),
  );

// Admin
router
  .route('/')
  .post(authenticate, authorize(['admin']), (req: Request, res: Response) =>
    ServiceController.createService(req as ServiceRequest, res),
  );

router
  .route('/:id')
  .put(authenticate, authorize(['admin']), (req: Request, res: Response) =>
    ServiceController.updateService(req as ServiceRequest, res),
  )
  .delete(authenticate, authorize(['admin']), (req: Request, res: Response) =>
    ServiceController.deleteService(req as ServiceRequest, res),
  );

export default router;
