import groupEmissionsByDate from "./GroupDatabydate";
import axios from "axios";
import WholeLineGraph from "./LineGraph";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import ElectricityLineGraph from "./electricity/bargraph";
import RoadLineGraph from "./byDist-TravelEmission/RoadLineGraph";
import FlightLineGraph from "./flightTravel/FlightLineGraph";
import TransportLineGraph from "./TransportLineGraph";

function DashboardEmission() {
  const [emissions, setEmissions] = useState([]);
  const [electricityEmissions, setELectriciyEmissions] = useState([]);
  const [roadEmissions, setRoadEmissions] = useState([]);
  const [flightEmissions, setFlightEmissions] = useState([]);
  const [transportEmissions, setTransportEmissions] = useState([]);
  useEffect(() => {
    console.log("sakshi");
    FetchEmissionsByDate("2025-07-01", "2025-07-21");
    console.log("abhishek");
  }, []);
  const FetchEmissionsByDate = async (from, to) => {
    // try {
    console.log("sahu");
    const emissionsELectricity = await axios.get("/api/emissions");
    let { data } = emissionsELectricity;
    const groupedElectricityData = groupEmissionsByDate(data);

    //   Collect unique detail IDs
    const detailIds = [...new Set(data.map((e) => e.detail))];

    //   Fetch all details in one go
    const response = await axios.get(`/api/details?ids=${detailIds.join(",")}`);
    const details = response.data;
    // Merge
    const merged = data.map((e) => ({
      ...e,
      detail: details.find((f) => f._id === e.detail),
    }));
    setELectriciyEmissions(merged);

    console.log("Fetched emissions:", groupedElectricityData);

    const emissionsRoad = await axios.get("/api/roadEmissions");
    let { data: roadData } = emissionsRoad;
    const groupedRoadData = groupEmissionsByDate(roadData);
    //   collect unique Id aboutVehi
    const vehicleDetailIds = [...new Set(roadData.map((e) => e.aboutVehi))];
    const responseVehicle = await axios.get(
      `/api/vehicleDetails?ids=${vehicleDetailIds.join(",")}`
    );
    const vehicleDetails = responseVehicle.data;
    // Merge road emissions
    const mergeRoad = roadData.map((e) => ({
      ...e,
      aboutVehicle: vehicleDetails.find((f) => f._id === e.aboutVehi),
    }));
    setRoadEmissions(mergeRoad);
    const flightEmission = await axios.get("/api/flightEmissions");
    let { data: flightData } = flightEmission;
    const groupedflightData = groupEmissionsByDate(flightData);
    console.log(groupedflightData);
    //   Collect Unique Ids for flight details
    const wholeTravelData = [...groupedRoadData, ...groupedflightData];
    const travelGroupedData = groupEmissionsByDate(wholeTravelData);
    console.log("check", travelGroupedData);
    if (travelGroupedData)
      setEmissions([groupedElectricityData, travelGroupedData]);
    const flightDetailIds = [...new Set(flightData.map((e) => e.aboutFlight))];
    const responseFlight = await axios.get(
      `/api/flightDetail?ids=${flightDetailIds.join(",")}`
    );
    const flightDetails = responseFlight.data;
    // Merge flight emissions
    const mergeflight = flightData.map((e) => ({
      ...e,
      aboutFlight: flightDetails.find((f) => f._id === e.aboutFlight),
    }));
    setFlightEmissions(mergeflight);
    setTransportEmissions([groupedRoadData, groupedflightData]);
    // } catch (error) {
    //   console.error("Error fetching emissions:", error);
    // }
  };

  console.log("abhishek");
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        // flexWrap: "wrap",
        gap: 3,
        alignItems: "center",
        justifyContent: "space-around",
        // margin: 3,
        // marginBottom: 10,
      }}
    >
      {transportEmissions ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            <ElectricityLineGraph data={electricityEmissions} />
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <RoadLineGraph data={roadEmissions} />
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <FlightLineGraph data={flightEmissions} />
          </Box>
        </Box>
      ) : (
        <p>loading...</p>
      )}

      {emissions && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 3,
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <Box sx={{ display: "flex", gap: 3 }}>
            <TransportLineGraph data={transportEmissions} />
          </Box>
          <Box sx={{ display: "flex", gap: 3 }}>
            <WholeLineGraph data={emissions} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default DashboardEmission;
