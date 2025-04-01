import axios from 'axios';
import Sensor from '../models/sensor.model.js';

/**
 * @swagger
 * /api/sensors/{sensorId}/threshold:
 *   post:
 *     summary: Set threshold for a sensor
 *     description: Sets the maximum and minimum value threshold for a sensor and sends it to Adafruit IO.
 *     tags:
 *       - Sensors
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: sensorId
 *         required: true
 *         description: ID of the sensor
 *         schema:
 *           type: string
 *           example: "60d4f84e4c7e8e0008bc3930"
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
    const { sensorId } = req.params;
    const { max_value, min_value } = req.body;

    // Check for valid max_value and min_value
    if (max_value === undefined || min_value === undefined) {
        return res
            .status(400)
            .json({ error: 'Max value and min value are required.' });
    }

    try {
        // Update the sensor threshold in the database
        const updatedSensor = await Sensor.findByIdAndUpdate(
            sensorId,
            { max_value, min_value },
            { new: true }
        );

        if (!updatedSensor) {
            return res.status(404).json({ error: 'Sensor not found' });
        }

        // Send the updated threshold data to Adafruit IO
        const adafruitIoUrl = `https://io.adafruit.com/api/v2/${process.env.ADAFRUIT_IO_USERNAME}/feeds/${process.env.ADAFRUIT_IO_FEED_NAME}/data`;
        const response = await axios.post(
            adafruitIoUrl,
            {
                value: JSON.stringify({
                    max_value: updatedSensor.max_value,
                    min_value: updatedSensor.min_value,
                }),
            },
            {
                headers: {
                    'X-AIO-Key': process.env.ADAFRUIT_IO_KEY,
                    'Content-Type': 'application/json',
                },
            }
        );

        // Check if the response from Adafruit IO is successful
        if (response.status === 200) {
            // Log the history for the action
            const history = new History({
                device: updatedSensor._id,
                user: req.user._id,
                message: `Threshold set to max: ${max_value}, min: ${min_value}`,
                time: new Date(),
            });
            await history.save();

            // Send the successful response back to the client
            res.json({
                success: true,
                message: 'Threshold updated and sent to Adafruit IO',
                sensor: updatedSensor,
            });
        } else {
            // Handle failure to send data to Adafruit IO
            res.status(500).json({
                error: 'Failed to send threshold to Adafruit IO',
            });
        }
    } catch (error) {
        console.error('Error setting threshold:', error.message);
        res.status(500).json({ error: 'Failed to set threshold' });
    }
};

export { setThreshold };
