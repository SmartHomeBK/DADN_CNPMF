import cron from 'node-cron';
import axios from 'axios';
import dotenv from 'dotenv';
import Schedule from '../models/schedule.model.js';
import Device from '../models/device.model.js';
import { BASE_URL, headers } from '../../config/adafruit.js';
import History from '../models/history.model.js';

dotenv.config();

// Chạy cron job mỗi phút
cron.schedule('1 * * * * *', async () => {
    let now = new Date();
    const nowVN = new Date(now.getTime() + 7 * 60 * 60 * 1000); // cộng 7 giờ

    const currentTime = nowVN.toTimeString().slice(0, 5); // Lấy HH:mm

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
                    await Device.updateOne(
                        { _id: device._id },
                        { status: schedule.action ? '1' : '0' }
                    );

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
