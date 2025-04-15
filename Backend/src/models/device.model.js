import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    status: String,
    location: String,
    max_value: {
      type: Number,
      default: 0,
    },
    min_value: {
      type: Number,
      default: 0,
    },
    auto: {
      type: Boolean,
      default: false,
    },
    last_updated: Date,
  },
  { timestamps: true }
);

const Device = mongoose.model("Device", deviceSchema);
export default Device;
