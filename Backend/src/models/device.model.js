const mongoose = require('mongoose');

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

module.exports = mongoose.model('Device', deviceSchema);
