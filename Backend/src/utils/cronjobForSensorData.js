import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import { BASE_URL, headers } from '../../config/adafruit.js';
import Sensor from '../models/sensor.model.js';
import SensorData from '../models/sensorData.model.js';

dotenv.config();

const fetchAndSaveSensorData = async () => {
    try {
        const [humidRes, tempRes, lightRes] = await Promise.all([
            axios.get(`${BASE_URL}/humid`, { headers }),
            axios.get(`${BASE_URL}/temperature`, { headers }),
            axios.get(`${BASE_URL}/light`, { headers }),
        ]);

        const humidValue = parseFloat(humidRes.data.last_value);
        const tempValue = parseFloat(tempRes.data.last_value);
        const lightValue = parseFloat(lightRes.data.last_value);
        const timestamp = new Date();

        const humidSensor = await Sensor.findOne({ type: 'humid' });
        const tempSensor = await Sensor.findOne({ type: 'temperature' });
        const lightSensor = await Sensor.findOne({ type: 'light' });

        const sensorDataEntries = [];
        if (humidSensor) {
            sensorDataEntries.push({
                sensor: humidSensor._id,
                value: humidValue,
                recorded_at: timestamp,
            });
        }

        if (tempSensor) {
            sensorDataEntries.push({
                sensor: tempSensor._id,
                value: tempValue,
                recorded_at: timestamp,
            });
        }

        if (lightSensor) {
            sensorDataEntries.push({
                sensor: lightSensor._id,
                // value: lightValue,
                value: 50,
                recorded_at: timestamp,
            });
        }

        if (sensorDataEntries.length > 0) {
            await SensorData.insertMany(sensorDataEntries);
            console.log('Sensor data saved to database.');
        }
    } catch (error) {
        console.error('Error fetching or saving sensor data:', error.message);
    }
};

// Chạy cron job mỗi 5 giây
cron.schedule('*/5 * * * * *', fetchAndSaveSensorData);
