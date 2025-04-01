import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import Schedule from '../models/schedule.model.js';
import { BASE_URL, headers } from '../../config/adafruit.js';

dotenv.config();

// Chạy cron job mỗi phút
cron.schedule('* * * * *', async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Lấy HH:mm

    console.log(`Checking schedules for time: ${currentTime}`);

    try {
        const schedules = await Schedule.find({
            start_time: currentTime,
        });

        for (const schedule of schedules) {
            console.log(
                `Executing action ${schedule.action} for device ${schedule.device}`
            );

            const device = await Device.findById(schedule.device);
            if (device) {
                const feedName = device.name.toLowerCase().replace(/\s+/g, '-');
                const adafruitUrl = `${BASE_URL}/${feedName}/data`;

                await axios.post(
                    adafruitUrl,
                    { value: schedule.action },
                    { headers }
                );

                console.log(`Action ${schedule.action} sent to ${feedName}`);
            }
        }
    } catch (error) {
        console.error('Error processing schedule:', error.message);
    }
});
