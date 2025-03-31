const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema(
    {
        type: String,
        max_value: Number,
        min_value: Number,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Sensor', sensorSchema);
