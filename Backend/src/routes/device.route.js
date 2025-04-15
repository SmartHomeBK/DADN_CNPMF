import { Router } from "express";
import {
  addDevice,
  controlDevice,
  deleteDevice,
  getDevices,
  updateDeviceSettings,
} from "../controller/device.controller.js";

const route = Router();

route.get("", getDevices);
route.post("/add", addDevice);
route.post("/delete", deleteDevice);
route.put("/control/:device", controlDevice);
route.put("/auto/:id", updateDeviceSettings);
export const DeviceRoute = route;
