import mongoose from "mongoose";

const majorElect = new mongoose.Schema({
  provider: {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  region: {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  owner: { type: String, required: true },
  count: { type: Number, required: true },
});

const MajorElectSupp = mongoose.model("MajorElectSupp", majorElect);
export default MajorElectSupp;
