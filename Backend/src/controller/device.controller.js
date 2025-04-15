import Device from "../models/device.model.js";
import axios from "axios";
import dotenv from "dotenv";
import { BASE_URL, headers } from "../../config/adafruit.js";
import History from "../models/history.model.js";

dotenv.config({ path: "./../Backend/config/.env" });

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     description: Fetches all devices from the system
 *     tags:
 *       - Devices
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   type:
 *                     type: string
 *                   status:
 *                     type: string
 *                   location:
 *                     type: string
 *                   last_updated:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
const getDevices = async (req, res) => {
  try {
    const devices = await Device.find();
    res.status(200).json(devices);
  } catch (error) {
    console.error("Error fetching devices:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Create a new device
 *     description: Adds a new device to the system
 *     tags:
 *       - Devices
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Fan"
 *               type:
 *                 type: string
 *                 example: "temperature"
 *               status:
 *                 type: string
 *                 example: "off"
 *               location:
 *                 type: string
 *                 example: "Greenhouse"
 *               max_value:
 *                 type: number
 *                 example: 100
 *               min_value:
 *                 type: number
 *                 example: 30
 *               auto:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       201:
 *         description: Successfully created device
 *       400:
 *         description: Bad request, missing fields
 *       500:
 *         description: Internal server error
 */
const addDevice = async (req, res) => {
  try {
    const { name, type, status, location, max_value, min_value, auto } =
      req.body;

    if (!name || !type || !status || !location) {
      return res.status(400).json({
        error: "Missing required fields: name, type, status, location",
      });
    }

    if (max_value !== undefined && typeof max_value !== "number") {
      return res.status(400).json({ error: "max_value must be a number" });
    }

    if (min_value !== undefined && typeof min_value !== "number") {
      return res.status(400).json({ error: "min_value must be a number" });
    }

    if (auto !== undefined && typeof auto !== "boolean") {
      return res.status(400).json({ error: "auto must be a boolean" });
    }

    const newDevice = new Device({
      name,
      type,
      status,
      location,
      max_value: max_value ?? null,
      min_value: min_value ?? null,
      auto: auto ?? false,
      last_updated: new Date(),
    });

    await newDevice.save();

    res.status(201).json({
      success: true,
      message: "Device created successfully",
      device: newDevice,
    });
  } catch (error) {
    console.error("Error creating device:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

/**
 * @swagger
 * /api/devices/control/{device}:
 *   put:
 *     summary: Control device (turn on/off)
 *     description: Allows manual control of devices (e.g., turn on/off a light or fan).
 *     tags:
 *       - Devices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Device name to control
 *         schema:
 *           type: string
 *           example: "Fan"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [on, off]
 *                 example: "on"
 *     responses:
 *       200:
 *         description: Successfully controlled device
 *       400:
 *         description: Invalid device or status
 *       500:
 *         description: Failed to control device
 */
const controlDevice = async (req, res) => {
  const { name } = req.params;
  const { state } = req.body;
  console.log("device name: ", name);
  if (!["1", "0"].includes(state)) {
    return res.status(400).json({ error: 'Invalid state. Use "1" or "0".' });
  }

  try {
    const feedName = name.toLowerCase().replace(/\s+/g, "-");
    const controlUrl = `${BASE_URL}/${feedName}/data`;
    const response = await axios.post(
      controlUrl,
      { value: state },
      { headers }
    );
    console.log("response from update light: ", response);
    if (response.status === 200) {
      console.log("feedName: ", name);
      const updatedDevice = await Device.findOneAndUpdate(
        { name },
        { status: state, Last_updated: new Date() },
        { new: true }
      );
      console.log("updatedDevice: ", updatedDevice);
      if (updatedDevice) {
        const history = new History({
          device: updatedDevice._id,
          user: req.user._id,
          message: `${name} turned ${state} by ${req.user.name}`,
          time: new Date(),
        });
        await history.save();

        return res.json({
          success: true,
          message: `${name} turned ${state}`,
        });
      }
      res.json({
        success: false,
        message: "Device not Found!",
      });
    } else {
      res.status(500).json({ error: "Failed to control device" });
    }
  } catch (error) {
    console.error(
      "Error controlling device:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: "Failed to control device" });
  }
};

/**
 * @swagger
 * /api/devices/auto/{id}:
 *   put:
 *     summary: Update min, max values and auto mode
 *     tags: [Devices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The device ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               min_value:
 *                 type: number
 *               max_value:
 *                 type: number
 *               auto:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
const updateDeviceSettings = async (req, res) => {
  const { id } = req.params;
  const { min_value, max_value, auto } = req.body;

  try {
    const update = {
      ...(min_value !== undefined && { min_value }),
      ...(max_value !== undefined && { max_value }),
      ...(auto !== undefined && { auto }),
      last_updated: new Date(),
    };

    const device = await Device.findByIdAndUpdate(id, update, {
      new: true,
    });

    if (!device) {
      return res.status(404).json({ error: "Device not found" });
    }

    res.json({
      success: true,
      message: "Device settings updated",
      device,
    });
  } catch (err) {
    console.error("Error updating device settings:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
const deleteDevice = async (req, res) => {
  try {
    const { _id } = req.body;
    const result = await Device.deleteOne({ _id });
    res.status(200).json({
      success: true,
      message: "Delete Cv successfully!",
    });
  } catch (error) {
    console.log("error in deleteDevice: ", error);
    res.status(500).json({ success: false, message: "Delete CV fail!!!" });
  }
};
export {
  addDevice,
  controlDevice,
  getDevices,
  updateDeviceSettings,
  deleteDevice,
};
