import { Router } from 'express';
import {
    addDevice,
    controlDevice,
    getDevices,
    updateDeviceSettings,
} from '../controller/device.controller.js';

const route = Router();

route.get('', getDevices);
route.post('', addDevice);
route.put('/control/:device', controlDevice);
route.put('/auto/:id', updateDeviceSettings);
export const DeviceRoute = route;
