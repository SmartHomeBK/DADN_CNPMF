import { mongoose } from 'mongoose';

const sensorDataSchema = new mongoose.Schema({
    sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' },
    value: Number,
    recorded_at: Date,
});

const SensorData = mongoose.model('SensorData', sensorDataSchema);
export default SensorData;
