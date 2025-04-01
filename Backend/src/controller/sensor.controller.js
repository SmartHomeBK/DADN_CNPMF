import axios from 'axios';
import Sensor from '../models/sensor.model.js';
import { BASE_URL, headers } from '../../config/adafruit.js';

/**
 * @swagger
 * /api/sensors:
 *   get:
 *     summary: Get all sensors
 *     description: Retrieves all sensors from the database.
 *     tags:
 *       - Sensors
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Sensors retrieved successfully
 *       500:
 *         description: Internal server error
 */
const getAllSensors = async (req, res) => {
    try {
        const sensors = await Sensor.find();
        res.status(200).json({
            success: true,
            message: 'Sensors retrieved successfully',
            sensors,
        });
    } catch (error) {
        console.error('Error retrieving sensors:', error.message);
        res.status(500).json({ error: 'Failed to retrieve sensors' });
    }
};

/**
 * @swagger
 * /api/sensors/{type}:
 *   get:
 *     summary: Get sensor by type
 *     description: Retrieves a sensor by its type (e.g., "temperature", "humidity").
 *     tags:
 *       - Sensors
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Type of the sensor (e.g., "temperature", "humidity")
 *         schema:
 *           type: string
 *           example: "temperature"
 *     responses:
 *       200:
 *         description: Sensor retrieved successfully
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Internal server error
 */
const getSensorByType = async (req, res) => {
    const { type } = req.params;

    try {
        const sensor = await Sensor.findOne({ type });

        if (!sensor) {
            return res.status(404).json({ error: 'Sensor not found' });
        }

        res.status(200).json({
            success: true,
            message: 'Sensor retrieved successfully',
            sensor,
        });
    } catch (error) {
        console.error('Error retrieving sensor:', error.message);
        res.status(500).json({ error: 'Failed to retrieve sensor' });
    }
};

/**
 * @swagger
 * /api/sensors:
 *   post:
 *     summary: Add a new sensor
 *     description: Adds a new sensor to the database.
 *     tags:
 *       - Sensors
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 description: Type of the sensor (e.g., "temperature", "humidity")
 *                 example: "temperature"
 *               max_value:
 *                 type: number
 *                 description: Maximum threshold value for the sensor
 *                 example: 50
 *               min_value:
 *                 type: number
 *                 description: Minimum threshold value for the sensor
 *                 example: 10
 *     responses:
 *       201:
 *         description: Sensor added successfully
 *       400:
 *         description: Invalid input or sensor already exists
 *       500:
 *         description: Internal server error
 */
const addSensor = async (req, res) => {
    const { type, max_value, min_value } = req.body;

    if (!type || max_value === undefined || min_value === undefined) {
        return res
            .status(400)
            .json({ error: 'Type, max_value, and min_value are required.' });
    }

    try {
        const existingSensor = await Sensor.findOne({ type });
        if (existingSensor) {
            return res
                .status(400)
                .json({ error: 'Sensor type already exists.' });
        }

        const newSensor = new Sensor({
            type,
            max_value,
            min_value,
            user: req.user._id,
        });
        await newSensor.save();

        res.status(201).json({
            success: true,
            message: 'Sensor added successfully',
            sensor: newSensor,
        });
    } catch (error) {
        console.error('Error adding sensor:', error.message);
        res.status(500).json({ error: 'Failed to add sensor' });
    }
};

/**
 * @swagger
 * /api/sensors/{type}/threshold:
 *   put:
 *     summary: Set threshold for a sensor by type
 *     description: Sets the maximum and minimum value threshold for a sensor based on its type and sends it to Adafruit IO.
 *     tags:
 *       - Sensors
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         description: Type of the sensor (e.g., "temperature", "humidity")
 *         schema:
 *           type: string
 *           example: "temperature"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               max_value:
 *                 type: number
 *                 description: Maximum threshold value for the sensor
 *                 example: 50
 *               min_value:
 *                 type: number
 *                 description: Minimum threshold value for the sensor
 *                 example: 10
 *     responses:
 *       200:
 *         description: Threshold set and sent to Adafruit IO successfully
 *       400:
 *         description: Invalid input or sensor not found
 *       500:
 *         description: Internal server error
 */
const setThreshold = async (req, res) => {
    const { type } = req.params;
    const { max_value, min_value } = req.body;

    if (max_value === undefined || min_value === undefined) {
        return res
            .status(400)
            .json({ error: 'Max value and min value are required.' });
    }

    try {
        const updatedSensor = await Sensor.findOneAndUpdate(
            { type },
            { max_value, min_value },
            { new: true }
        );

        if (!updatedSensor) {
            return res.status(404).json({ error: 'Sensor not found' });
        }

        const adafruitIoUrl = `${BASE_URL}/${type}/threshold`;
        const response = await axios.post(
            adafruitIoUrl,
            {
                value: JSON.stringify({
                    max_value: updatedSensor.max_value,
                    min_value: updatedSensor.min_value,
                }),
            },
            {
                headers,
            }
        );

        if (response.status === 200) {
            const history = new History({
                device: updatedSensor._id,
                user: req.user._id,
                message: `Threshold set to max: ${max_value}, min: ${min_value} by ${req.user.name}`,
                time: new Date(),
            });
            await history.save();

            res.status(200).json({
                success: true,
                message: 'Threshold updated and sent to Adafruit IO',
                sensor: updatedSensor,
            });
        } else {
            res.status(500).json({
                error: 'Failed to send threshold to Adafruit IO',
            });
        }
    } catch (error) {
        console.error('Error setting threshold:', error.message);
        res.status(500).json({ error: 'Failed to set threshold' });
    }
};

export { setThreshold, getSensorByType, getAllSensors, addSensor };
