import { Router } from 'express';
import {
    addSensor,
    getAllSensors,
    getSensorByType,
    setThreshold,
} from '../controller/sensor.controller.js';

const route = Router();

route.get('', getAllSensors);
route.get('/:type', getSensorByType);
route.post('', addSensor); // Assuming this is for creating a new sensor
route.put('/:type/threshold', setThreshold);

export const SensorRoute = route;
