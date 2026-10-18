import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
export declare const createHealthRouter: (controller: HealthController) => Router;
