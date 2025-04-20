import axios from 'axios';
import Schedule from '../models/schedule.model.js';
import History from '../models/history.model.js';
import Device from '../models/device.model.js';
import dotenv from 'dotenv';

dotenv.config({ path: './../Backend/config/.env' });

/**
 * @swagger
 * /api/schedules:
 *   get:
 *     summary: Get all schedules
 *     description: Retrieves all schedules from the system.
 *     tags:
 *       - Schedules
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   device:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                     format: HH:mm
 *                     example: "12:00"
 *                   action:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       500:
 *         description: Internal server error
 */
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find().populate(
            'device',
            'name type status location'
        ); // Populate device data
        res.status(200).json(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/schedules/device/{deviceName}:
 *   get:
 *     summary: Get schedules by device name
 *     description: Retrieves schedules for a specific device based on its name.
 *     tags:
 *       - Schedules
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: deviceName
 *         required: true
 *         description: The name of the device to retrieve schedules for
 *         schema:
 *           type: string
 *           example: "Temperature Sensor"
 *     responses:
 *       200:
 *         description: List of schedules for the device
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   device:
 *                     type: string
 *                   start_time:
 *                     type: string
 *                     format: HH:mm
 *                     example: "12:00"
 *                   action:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *       404:
 *         description: Device not found
 *       500:
 *         description: Internal server error
 */
const getSchedulesByDeviceName = async (req, res) => {
    const { deviceName } = req.params;
    try {
        const device = await Device.findOne({ name: deviceName });
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }

        const schedules = await Schedule.find({ device: device._id }).populate(
            'device',
            'name type status location'
        );
        res.status(200).json(schedules);
    } catch (error) {
        console.error(
            'Error fetching schedules by device name:',
            error.message
        );
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/schedules:
 *   post:
 *     summary: Create a schedule for controlling a device
 *     description: Allows users to set a schedule for controlling a device at a specific time.
 *     tags:
 *       - Schedules
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceId:
 *                 type: string
 *                 description: ID of the device to schedule
 *                 example: "67ebddd0d12aa76bcecd5085"
 *               start_time:
 *                 type: string
 *                 description: The time when the action will be triggered, in HH:mm format
 *                 example: "12:00"
 *               action:
 *                 type: boolean
 *                 enum: [on, off]
 *                 description: The action to perform (turn the device on or off)
 *                 example: true
 *     responses:
 *       201:
 *         description: Schedule created successfully and device updated on Adafruit IO
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Schedule created and device updated on Adafruit IO"
 *                 schedule:
 *                   type: object
 *                   properties:
 *                     device:
 *                       type: string
 *                       example: "60a5c8b8f1b0e2d2f4a1c2b1"
 *                     start_time:
 *                       type: string
 *                       format: HH:mm
 *                       example: "12:00"
 *                     action:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request, missing required fields
 *       404:
 *         description: Device not found
 *       500:
 *         description: Internal server error
 */
const setSchedule = async (req, res) => {
    try {
        const { deviceId, start_time, action } = req.body;

        if (!deviceId || !start_time || !action) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const device = await Device.findById(deviceId);
        if (!device) {
            return res.status(404).json({ error: 'Device not found' });
        }
        console.log('device: ', device);
        const oldSchedule = await Schedule.findOne({
            device: deviceId,
            start_time,
        });
        if (oldSchedule) {
            return res.status(400).json({ error: 'Schedule already exists' });
        }

        const schedule = new Schedule({ device: deviceId, start_time, action });
        await schedule.save();

        const history = new History({
            device: deviceId,
            user: req.user.id,
            message: `Scheduled ${action} at ${new Date(
                start_time
            ).toLocaleString()} by ${req.user.name}`,
            time: new Date(),
        });
        await history.save();
        const returnValue = {
            ...schedule.toObject(),
            device: {
                name: device.name,
                type: device.type,
                status: device.status,
                location: device.location,
                _id: device._id,
            },
        };
        res.status(201).json({
            success: true,
            message: 'Schedule created and device updated on Adafruit IO',
            returnValue,
        });
    } catch (error) {
        console.error('Error setting schedule:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

/**
 * @swagger
 * /api/schedules/{scheduleId}:
 *   delete:
 *     summary: Delete a schedule
 *     description: Deletes a schedule by its ID and removes the corresponding schedule from Adafruit IO.
 *     tags:
 *       - Schedules
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: scheduleId
 *         required: true
 *         description: The ID of the schedule to delete
 *         schema:
 *           type: string
 *           example: "60a5c8b8f1b0e2d2f4a1c2b2"
 *     responses:
 *       200:
 *         description: Schedule deleted successfully and removed from Adafruit IO
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Schedule deleted successfully and removed from Adafruit IO"
 *       404:
 *         description: Schedule or device not found
 *       500:
 *         description: Internal server error
 */
const deleteSchedule = async (req, res) => {
    try {
        const { scheduleId } = req.params;

        const schedule = await Schedule.findByIdAndDelete(scheduleId);

        if (!schedule) {
            return res.status(404).json({ error: 'Schedule not found' });
        }

        const device = await Device.findById(schedule.device);
        if (!device) {
            return res
                .status(404)
                .json({ error: 'Device not found for this schedule' });
        }

        const history = new History({
            device: schedule.device,
            user: req.user._id,
            message: `Deleted schedule for device`,
            time: new Date(),
        });
        await history.save();

        res.status(200).json({
            success: true,
            message:
                'Schedule deleted successfully and removed from Adafruit IO',
        });
    } catch (error) {
        console.error('Error deleting schedule:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    getAllSchedules,
    getSchedulesByDeviceName,
    setSchedule,
    deleteSchedule,
};
