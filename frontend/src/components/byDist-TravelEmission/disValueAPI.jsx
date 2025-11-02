import TravelEmissionByDistance from "./distValueform";
import axios from "axios";
import { useEmissionStore, useCallStore } from "../../emissionStore";
function DistanceAPI() {
  const addEmission = useEmissionStore((state) => state.addEmission);
  const increase = useEmissionStore((state) => state.increase);
  const addCall = useCallStore((state) => state.addCall);
  const handleTravelSubmit = async (data) => {
    console.log("Travel Data Submitted:", data);
    const travelData = await axios.post(
      "/api/travel-emission/distances",
      data,
      { headers: { Authorization: localStorage.getItem("token") } }
    );
    console.log("Travel Emission Data:", travelData.data);
    const emissionData = {
      quantity: travelData.data.distance_value,
      unit: travelData.data.distance_unit,
      co2e_kg: travelData.data.co2e_kg,
      co2e_gm: travelData.data.co2e_gm,
      fuel_type: travelData.data.fuel_type,
    };
    const resultEmission = {
      id: "/api/travel-emission/distances",
      data: emissionData,
    };
    addEmission(resultEmission);
    increase();
    addCall("/api/travel-emission/distances");
    // useEmissionStore.persist.clearStorage();
    // useCallStore.persist.clearStorage();
    // console.log("Travel Emission Data added to store:", resultEmission);
  };

  return <TravelEmissionByDistance onSubmit={handleTravelSubmit} />;
}

export default DistanceAPI;
