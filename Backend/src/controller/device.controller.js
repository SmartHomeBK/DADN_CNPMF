import Device from '../models/device.model.js';
import axios from 'axios';
import dotenv from 'dotenv';
import { BASE_URL, headers } from '../../config/adafruit.js';
import History from '../models/history.model.js';

dotenv.config({ path: './../Backend/config/.env' });

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
        console.error('Error fetching devices:', error.message);
        res.status(500).json({ error: 'Internal server error' });
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
 *                 example: "fan"
 *               type:
 *                 type: string
 *                 example: "temperature"
 *               status:
 *                 type: string
 *                 example: "off"
 *               location:
 *                 type: string
 *                 example: "Greenhouse"
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
        const { name, type, status, location } = req.body;

        if (!name || !type || !status || !location) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const newDevice = new Device({
            name,
            type,
            status,
            location,
            last_updated: new Date(),
        });

        await newDevice.save();
        res.status(201).json({
            success: true,
            message: 'Device created successfully',
            device: newDevice,
        });
    } catch (error) {
        console.error('Error creating device:', error.message);
        res.status(500).json({ error: 'Internal server error' });
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
 *           example: "Temperature Sensor"
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
    const { name: device } = req.params;
    const { state } = req.body;

    if (!['1', '0'].includes(state)) {
        return res
            .status(400)
            .json({ error: 'Invalid state. Use "1" or "0".' });
    }

    try {
        const feedName = device.toLowerCase().replace(/\s+/g, '-');
        const controlUrl = `${BASE_URL}/${feedName}/data`;
        const response = await axios.post(
            controlUrl,
            { value: state },
            { headers }
        );
        console.log('response from update light: ', response);
        if (response.status === 200) {
            console.log('feedName: ', device);
            const updatedDevice = await Device.findOneAndUpdate(
                { name: device },
                { status: state, Last_updated: new Date() },
                { new: true }
            );
            if (updatedDevice) {
                const history = new History({
                    device: updatedDevice._id,
                    user: req.user._id,
                    message: `${device} turned ${state} by ${req.user.name}`,
                    time: new Date(),
                });
                await history.save();

                return res.json({
                    success: true,
                    message: `${device} turned ${state}`,
                });
            }
            res.json({
                success: false,
                message: 'Device not Found!',
            });
        } else {
            res.status(500).json({ error: 'Failed to control device' });
        }
    } catch (error) {
        console.error(
            'Error controlling device:',
            error.response ? error.response.data : error.message
        );
        res.status(500).json({ error: 'Failed to control device' });
    }
};

/**
 * @swagger
 * /api/devices/auto/{device}:
 *   put:
 *     summary: Set auto mode for device
 *     description: Updates the auto setting for a device and sends it to Adafruit
 *     tags:
 *       - Devices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: device
 *         required: true
 *         description: Device name to set auto mode
 *         schema:
 *           type: string
 *           example: "Temperature Sensor"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               auto:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Successfully updated auto mode
 *       400:
 *         description: Invalid device or auto value
 *       500:
 *         description: Failed to update auto mode
 */
const setAuto = async (req, res) => {
    const { device } = req.params;
    const { auto } = req.body; // auto: true/false

    if (typeof auto !== 'boolean') {
        return res
            .status(400)
            .json({ error: 'Invalid value for auto. Must be true or false.' });
    }

    try {
        const updatedDevice = await Device.findOneAndUpdate(
            { name: device },
            { auto: auto, last_updated: new Date() },
            { new: true }
        );

        if (!updatedDevice) {
            return res.status(400).json({ error: 'Device not found' });
        }

        const feedName = device.toLowerCase().replace(/\s+/g, '-');
        const controlUrl = `${BASE_URL}/${feedName}/data`;

        const response = await axios.post(
            controlUrl,
            { value: auto ? 1 : 0 },
            { headers }
        );

        if (response.status === 200) {
            // Optionally log the action
            const history = new History({
                device: updatedDevice._id,
                user: req.user._id,
                message: `${device} auto mode set to ${
                    auto ? 'enabled' : 'disabled'
                } by ${req.user.name}`,
                time: new Date(),
            });
            await history.save();

            return res.json({
                success: true,
                message: `${device} auto mode set to ${
                    auto ? 'enabled' : 'disabled'
                }`,
            });
        } else {
            res.status(500).json({
                error: 'Failed to send auto setting to Adafruit',
            });
        }
    } catch (error) {
        console.error('Error setting auto mode:', error.message);
        res.status(500).json({ error: 'Failed to update auto mode' });
    }
};

export { addDevice, controlDevice, getDevices, setAuto };
