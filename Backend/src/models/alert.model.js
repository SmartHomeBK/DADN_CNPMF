const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
    sensor: { type: mongoose.Schema.Types.ObjectId, ref: 'Sensor' },
    time: Date,
    message: String,
});

module.exports = mongoose.model('Alert', alertSchema);
