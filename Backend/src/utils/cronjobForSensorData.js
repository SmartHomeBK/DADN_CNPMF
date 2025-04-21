import cron from "node-cron";
import axios from "axios";
import dotenv from "dotenv";
import { BASE_URL, headers } from "../../config/adafruit.js";
import Sensor from "../models/sensor.model.js";
import SensorData from "../models/sensorData.model.js";
import Device from "../models/device.model.js";
import History from "../models/history.model.js";
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

    const humidSensor = await Sensor.findOne({ type: "humid" });
    const tempSensor = await Sensor.findOne({ type: "temperature" });
    const lightSensor = await Sensor.findOne({ type: "light" });

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
        value: lightValue,
        recorded_at: timestamp,
      });
    }

    if (sensorDataEntries.length > 0) {
      await SensorData.insertMany(sensorDataEntries);
      console.log("Sensor data saved to database.");
    }

    const devices = await Device.find({ auto: true });

    devices.forEach(async (device) => {
      const name = device.name.toLocaleLowerCase();

      if (name === "fan") {
        if (tempValue > device.max_value) {
          axios.post(`${BASE_URL}/fan/data`, { value: 1 }, { headers });
          await Device.updateOne({ _id: device._id }, { status: "on" });
          await History.create({
            device: device._id,
            message: `Device ${device.name} turned off due to high temperature (${tempValue}°C)`,
            time: timestamp,
          });
        } else if (tempValue < device.min_value) {
          axios.post(`${BASE_URL}/fan/data`, { value: 0 }, { headers });
          await Device.updateOne({ _id: device._id }, { status: "off" });
          await History.create({
            device: device._id,
            message: `Device ${device.name} turned on due to low temperature (${tempValue}°C)`,
            time: timestamp,
          });
        }
      }
      if (name === "lightbulb") {
        if (lightValue < device.min_value) {
          axios.post(`${BASE_URL}/lightbulb/data`, { value: 1 }, { headers });

          await Device.updateOne({ _id: device._id }, { status: "on" });
          await History.create({
            device: device._id,
            message: `Device ${device.name} turned on due to low light (${lightValue})`,
            time: timestamp,
          });
        } else if (lightValue > device.max_value) {
          axios.post(`${BASE_URL}/lightbulb/data`, { value: 0 }, { headers });
          await Device.updateOne({ _id: device._id }, { status: "off" });
          await History.create({
            device: device._id,
            message: `Device ${device.name} turned off due to high light (${lightValue})`,
            time: timestamp,
          });
        }
      }
    });
  } catch (error) {
    console.error("Error fetching or saving sensor data:", error.message);
  }
};

// Chạy cron job mỗi 5 giây
cron.schedule("*/16 * * * * *", fetchAndSaveSensorData);
