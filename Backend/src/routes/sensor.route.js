import { Router } from 'express';
import {
    addSensor,
    getAllSensors,
    getSensorByType,
    setThreshold,
} from '../controller/sensor.controller.js';

const route = Router();

route.get('', getAllSensors);
route.post('', addSensor); // Assuming this is for creating a new sensor
route.get('/:type', getSensorByType);
route.put('/:sensorId/threshold', setThreshold);

export const SensorRoute = route;
