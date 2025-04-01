import { Router } from 'express';
import {
    getEnvironmentDataInRange,
    getEnvironmentValues,
} from '../controller/envValues.controller.js';
export const route = Router();

route.get('/humid', getEnvironmentValues);
route.get('/humid/range', getEnvironmentDataInRange);
export const EnvRouter = route;
