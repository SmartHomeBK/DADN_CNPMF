import { Router } from 'express';
import {
    addDevice,
    controlDevice,
    getDevices,
} from '../controller/device.controller.js';

const route = Router();

route.get('', getDevices);
route.post('', addDevice);
route.put('/control/:name', controlDevice);
export const DeviceRoute = route;
