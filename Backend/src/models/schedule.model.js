import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    device: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Device',
        required: true,
    },
    start_time: {
        type: String,
        required: true,
        match: /^([01]\d|2[0-3]):([0-5]\d)$/,
    }, // HH:mm
    action: String,
});
scheduleSchema.index({ device: 1, start_time: 1 }, { unique: true });

const Schedule = mongoose.model('Schedule', scheduleSchema);
export default Schedule;
