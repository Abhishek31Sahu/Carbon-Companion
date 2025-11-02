import mongoose from "mongoose";

const transportdb = new mongoose.Schema({
  distance: { type: Number, required: true },
  distance_unit: { type: String, required: true },
  co2e: { type: Number, required: true },
  co2e_unit: { type: String, required: true },
  fixedroute: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  aboutVehi: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "VehicleInfo",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const RoadTransportEmi = mongoose.model("RoadTransportEmi", transportdb);
export default RoadTransportEmi;
