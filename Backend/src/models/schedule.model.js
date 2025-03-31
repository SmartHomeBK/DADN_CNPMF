const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    start_time: Date,
    end_time: Date,
});

module.exports = mongoose.model('Schedule', scheduleSchema);
