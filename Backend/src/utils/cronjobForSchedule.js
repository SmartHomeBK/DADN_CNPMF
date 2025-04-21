import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import Schedule from '../models/schedule.model.js';
import Device from '../models/device.model.js';
import { BASE_URL, headers } from '../../config/adafruit.js';

dotenv.config();

// Chạy cron job mỗi phút
cron.schedule('*/5 * * * * *', async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Lấy HH:mm

    try {
        const schedules = await Schedule.find({
            start_time: currentTime,
        });

        await Promise.all(
            schedules.map(async (schedule) => {
                try {
                    const device = await Device.findById(schedule.device);
                    if (!device) return;

                    const feedName = device.name
                        .toLowerCase()
                        .replace(/\s+/g, '-');
                    const adafruitUrl = `${BASE_URL}/${feedName}/data`;

                    await axios.post(
                        adafruitUrl,
                        { value: schedule.action ? '1' : '0' },
                        { headers }
                    );

                    console.log(
                        `Action ${schedule.action} sent to ${feedName}`
                    );
                } catch (err) {
                    console.error(
                        `Error with schedule ${schedule._id}:`,
                        err.message
                    );
                }
            })
        );
    } catch (error) {
        console.error('Error processing schedule:', error.message);
    }
});
