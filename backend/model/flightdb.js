import mongoose from "mongoose";

const transportdb = new mongoose.Schema({
  co2e: { type: Number, required: true },
  co2e_unit: { type: String, required: true },
  date: { type: Date, default: Date.now },
  aboutFlight: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FlightInfo",
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const flightEmission = mongoose.model("flightEmission", transportdb);
export default flightEmission;
