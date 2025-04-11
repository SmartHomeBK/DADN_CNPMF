import { Router } from 'express';
import {
    getEnvironmentDataInRange,
    getEnvironmentValues,
} from '../controller/envValues.controller.js';
export const route = Router();

route.get('', getEnvironmentValues);
route.get('/range', getEnvironmentDataInRange);
export const EnvRouter = route;
