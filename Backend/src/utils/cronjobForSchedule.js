import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import Schedule from '../models/schedule.model.js';
import Device from '../models/device.model.js';
import { BASE_URL, headers } from '../../config/adafruit.js';
import History from '../models/history.model.js';

dotenv.config();

// Chạy cron job mỗi phút
cron.schedule('/50 * * * * *', async () => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Lấy HH:mm

    try {
        const schedules = await Schedule.find({
            start_time: currentTime,
        });
        console.log('Current time:', currentTime);

        await Promise.all(
            schedules.map(async (schedule) => {
                try {
                    console.log(
                        `Processing schedule ${schedule._id} for device ${schedule.device}`
                    );
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
                    await Schedule.findByIdAndUpdate(schedule._id, {
                        $set: { status: schedule.action ? 'on' : 'off' },
                    });

                    await History.create({
                        device: device._id,
                        message: `Device ${device.name} turned ${
                            schedule.action ? 'on' : 'off'
                        }`,
                        time: now,
                    });
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
