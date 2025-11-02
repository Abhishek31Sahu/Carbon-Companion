import FuelValue from "./userInputFuel";
import axios from "axios";

function FuelAPI() {
  const handleTravelSubmit = async (data) => {
    const travelData = await axios.post("/api/travel-emission/fuel", data);
    console.log("Travel Emission Data:", travelData.data);
  };

  return <FuelValue onSumbit={handleTravelSubmit} />;
}

export default FuelAPI;
