import { Router } from 'express';
import { setThreshold } from '../controller/sensor.controller.js';

const route = Router();

route.put('/:sensorId/threshold', setThreshold);

export const SensorRoute = route;
