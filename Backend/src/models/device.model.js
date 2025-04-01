import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
    {
        DeviceName: String,
        DeviceType: String,
        Status: String,
        Location: String,
        Last_updated: Date,
    },
    { timestamps: true }
);

const Device = mongoose.model('Device', deviceSchema);
export default Device;
