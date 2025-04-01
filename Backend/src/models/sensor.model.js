import mongoose from 'mongoose';
const sensorSchema = new mongoose.Schema(
    {
        type: { type: mongoose.Schema.Types.String, unique: true },
        max_value: Number,
        min_value: Number,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

const Sensor = mongoose.model('Sensor', sensorSchema);
export default Sensor;
