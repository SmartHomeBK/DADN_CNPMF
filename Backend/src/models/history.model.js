import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    device: { type: mongoose.Schema.Types.ObjectId, ref: 'Device' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: mongoose.Schema.Types.String, require: true },
    time: Date,
});

const History = mongoose.model('History', historySchema);
export default History;
