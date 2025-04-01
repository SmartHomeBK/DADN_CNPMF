import Device from '../models/device.model.js';
import axios from 'axios';

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
 *               DeviceName:
 *                 type: string
 *                 example: "Temperature Sensor"
 *               Status:
 *                 type: string
 *                 example: "off"
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
        const { DeviceName, Status } = req.body;

        if (!DeviceName || !Status) {
            return res
                .status(400)
                .json({ error: 'DeviceName and Status are required' });
        }

        const newDevice = new Device({
            DeviceName,
            Status,
            Last_updated: new Date(),
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
 * /api/device/control/{device}:
 *   post:
 *     summary: Control device (turn on/off)
 *     description: Allows manual control of devices (e.g., turn on/off a light or fan).
 *     tags:
 *       - Devices
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: device
 *         required: true
 *         description: Device to control (light, fan, etc.)
 *         schema:
 *           type: string
 *           example: "light"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [on, off]
 *                 description: State to turn the device on or off
 *                 example: "on"
 *     responses:
 *       200:
 *         description: Successfully controlled device
 *       400:
 *         description: Invalid device or state
 *       500:
 *         description: Failed to control device
 */
const controlDevice = async (req, res) => {
    const { device } = req.params;
    const { state } = req.body;

    if (!['on', 'off'].includes(state)) {
        return res
            .status(400)
            .json({ error: 'Invalid state. Use "on" or "off".' });
    }

    try {
        const controlUrl = `${BASE_URL}/${device}/data`;
        const response = await axios.post(
            controlUrl,
            { value: state },
            { headers }
        );

        if (response.status === 200) {
            const updatedDevice = await Device.findOneAndUpdate(
                { DeviceName: device },
                { Status: state, Last_updated: new Date() },
                { new: true }
            );

            const history = new History({
                device: updatedDevice._id,
                user: req.user._id,
                message: `${device} turned ${state} by ${req.user.name}`,
                time: new Date(),
            });
            await history.save();

            res.json({ success: true, message: `${device} turned ${state}` });
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

export { addDevice, controlDevice };
