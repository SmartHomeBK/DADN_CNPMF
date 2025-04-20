import axios from "axios";
import dotenv from "dotenv";
import { BASE_URL, headers } from "../../config/adafruit.js";
import SensorData from "../models/sensorData.model.js";

dotenv.config({ path: "./../Backend/config/.env" });

import Sensor from "../models/sensor.model.js";

/**
 * @swagger
 * /api/env:
 *   get:
 *     summary: Get environment values (humidity, temperature, light)
 *     description: Fetches the latest humidity, temperature, and light values from Adafruit IO.
 *     tags:
 *       - Environment
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved environment values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 humid:
 *                   type: number
 *                   example: 55.5
 *                 temp:
 *                   type: number
 *                   example: 27.3
 *                 light:
 *                   type: number
 *                   example: 500
 *       500:
 *         description: Failed to fetch environment data
 */

const raiseOutOfRange = (type, cur_val, min_val, max_val) => {
  if (cur_val < min_val)
    return `Current ${type} value ${cur_val} is under allowed min value: ${min_val}`;
  else if (cur_val > max_val)
    return `Current ${type} value ${cur_val} is higher allowed max value: ${max_val}`;
};
const getEnvironmentValues = async (req, res) => {
  try {
    const humidSensor = await Sensor.findOne({ type: "humidity" });
    const tempSensor = await Sensor.findOne({ type: "temperature" });
    const lightSensor = await Sensor.findOne({ type: "light" });

    const [humidRes, tempRes, lightRes] = await Promise.all([
      axios.get(`${BASE_URL}/humid`, { headers }),
      axios.get(`${BASE_URL}/temperature`, { headers }),
      axios.get(`${BASE_URL}/light`, { headers }),
    ]);

    const { last_value: humid } = humidRes.data;
    const { last_value: temp } = tempRes.data;
    const { last_value: light } = lightRes.data;

    const result = {};

    result.humid = {
      value: humid,
      outOfRange:
        humidSensor?.min_value && humidSensor?.max_value
          ? humid < humidSensor.min_value || humid > humidSensor.max_value
            ? raiseOutOfRange(
                "humid",
                humid,
                humidSensor.min_value,
                humidSensor.max_value
              )
            : "NO"
          : null,
    };

    result.temp = {
      value: temp,
      outOfRange:
        tempSensor?.min_value && tempSensor?.max_value
          ? temp < tempSensor.min_value || temp > tempSensor.max_value
            ? raiseOutOfRange(
                "temperature",
                temp,
                tempSensor.min_value,
                tempSensor.max_value
              )
            : "NO"
          : null,
    };

    result.light = {
      value: light,
      outOfRange:
        lightSensor?.min_value && lightSensor?.max_value
          ? light < lightSensor.min_value || light > lightSensor.max_value
            ? raiseOutOfRange(
                "light",
                light,
                lightSensor.min_value,
                lightSensor.max_value
              )
            : "NO"
          : null,
    };

    console.log("Fetched and checked data: ", result);

    res.json(result);
  } catch (error) {
    console.error(
      "Error fetching environment data:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error });
  }
};

/**
 * @swagger
 * /api/env/range:
 *   get:
 *     summary: Get environment values (humidity, temperature, light) for a time range from the database
 *     description: Fetches the humidity, temperature, and light values for the specified time range from the database.
 *     tags:
 *       - Environment
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startTime
 *         required: true
 *         description: The start time of the range to fetch data for.
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-04-01T12:00:00Z"
 *       - in: query
 *         name: endTime
 *         required: true
 *         description: The end time of the range to fetch data for.
 *         schema:
 *           type: string
 *           format: date-time
 *           example: "2025-04-01T12:05:00Z"
 *     responses:
 *       200:
 *         description: Successfully retrieved environment values
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 humid:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [55.5, 56.2, 57.3]
 *                 temp:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [27.3, 27.4, 27.5]
 *                 light:
 *                   type: array
 *                   items:
 *                     type: number
 *                   example: [500, 505, 510]
 *       500:
 *         description: Failed to fetch or store environment data
 */
const getEnvironmentDataInRange = async (req, res) => {
  const { startTime, endTime } = req.query;

  try {
    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    const sensorData = await SensorData.find({
      recorded_at: { $gte: startDate, $lte: endDate },
    })
      .populate("sensor", "type")
      .lean();

    const humidData = sensorData.filter((data) => data.sensor.type === "humid");
    const tempData = sensorData.filter(
      (data) => data.sensor.type === "temperature"
    );
    const lightData = sensorData.filter((data) => data.sensor.type === "light");

    const humidValues = humidData.map((data) => data.value);
    const tempValues = tempData.map((data) => data.value);
    const lightValues = lightData.map((data) => data.value);

    res.status(200).json({
      humid: humidValues,
      temp: tempValues,
      light: lightValues,
    });
  } catch (error) {
    console.error(
      "Error fetching environment data from the database:",
      error.message
    );
    res.status(500).json({ error: "Failed to fetch environment data" });
  }
};

export { getEnvironmentValues, getEnvironmentDataInRange };
