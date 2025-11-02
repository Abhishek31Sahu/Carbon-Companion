import mongoose from "mongoose";

const vehicle = new mongoose.Schema({
  type: { type: String, required: true },
  fuel: { type: String, required: true },
  count: { type: Number, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const vehicleInfo = mongoose.model("vehicleInfo", vehicle);
export default vehicleInfo;

// https://driving-distance-calculator-between-two-points.p.rapidapi.com/data
