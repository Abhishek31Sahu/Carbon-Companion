import React from "react";
import axios from "axios";
import AnalysisBox from "../byDist-TravelEmission/analysisBox";
import DecideResult from "../byDist-TravelEmission/DecideResult";
import Footer from "../byDist-TravelEmission/footer";
import LiveMapTracker from "./track";
import TopHeading from "../byDist-TravelEmission/heading";
// import { useLocation } from "react-router-dom";
import { useEmissionStore, useCallStore } from "../../emissionStore";
function MapWithResult() {
  const addEmission = useEmissionStore((state) => state.addEmission);
  const increase = useEmissionStore((state) => state.increase);
  const addCall = useCallStore((state) => state.addCall);
  const removeEmission = useEmissionStore((state) => state.removeEmission);
  //   const location = useLocation();
  const updateDist = async (distance) => {
    console.log("Distance from MapWithResult:", distance);
    // setDistance(data);
    const vehicleInfo = JSON.parse(localStorage.getItem("vehicleInfo")) || null;
    const reqInfo = { ...vehicleInfo, distance };
    console.log(reqInfo);
    const travelData = await axios.post(
      "/api/travel-emission/distances",
      reqInfo
    );
    console.log(travelData.data);
    const emissionData = {
      quantity: travelData.data.distance_value,
      unit: travelData.data.distance_unit,
      co2e_kg: travelData.data.co2e_kg,
      co2e_gm: travelData.data.co2e_gm,
      fuel_type: travelData.data.fuel_type,
    };
    const resultEmission = {
      id: "/live-emission/map",
      data: emissionData,
    };
    addEmission(resultEmission);
    increase();
    addCall("/live-emission/map");
    setTimeout(() => {
      removeEmission("/live-emission/map");
    }, 10 * 60 * 1000);
  };
  return (
    <div>
      <TopHeading />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          margin: "20px",
          gap: "50px",
        }}
      >
        <LiveMapTracker dist={updateDist} />
        <DecideResult id={"/live-emission/map"} />
      </div>
      <Footer />
    </div>
  );
}

export default MapWithResult;
