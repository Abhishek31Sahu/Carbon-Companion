import mongoose from "mongoose";

const flight = new mongoose.Schema({
  From: { type: String, required: true },
  To: { type: String, required: true },
  count: { type: Number, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const FlightInfo = mongoose.model("FlightInfo", flight);
export default FlightInfo;
