const mongoose = require('mongoose');

const sensorDataSchema = new mongoose.Schema({
    sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' },
    value: Number,
    recorded_at: Date,
});

module.exports = mongoose.model('SensorData', sensorDataSchema);
