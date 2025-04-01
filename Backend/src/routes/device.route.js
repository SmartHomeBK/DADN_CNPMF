import { Router } from 'express';
import { addDevice, controlDevice } from '../controller/device.controller.js';

const route = Router();

route.post('', addDevice);
route.post('/control/:device', controlDevice);
export const DeviceRoute = route;
