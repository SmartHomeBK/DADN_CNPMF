const { default: mongoose } = require('mongoose');

const historySchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    time: Date,
});

module.exports = mongoose.model('History', historySchema);
