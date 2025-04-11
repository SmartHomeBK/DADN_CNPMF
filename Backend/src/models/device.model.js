import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema(
    {
        name: String,
        type: String,
        status: String,
        location: String,
        max_value: Number,
        min_value: Number,
        auto: Boolean,
        last_updated: Date,
    },
    { timestamps: true }
);

const Device = mongoose.model('Device', deviceSchema);
export default Device;
