import mongoose from "mongoose";
const sensorSchema = new mongoose.Schema(
  {
    type: { type: mongoose.Schema.Types.String, unique: true },
    max_value: {
      type: Number,
      default: 0,
    },
    min_value: {
      type: Number,
      default: 0,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Sensor = mongoose.model("Sensor", sensorSchema);
export default Sensor;
