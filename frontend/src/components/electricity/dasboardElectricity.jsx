import axios from "axios";
import React, { useState } from "react";
import DateInput from "./dateInput";
import BarGraph from "./bargraph"; // Assuming you have a BarGraph component to visualize emissions

function DashboardElectricity() {
  const [emissions, setEmissions] = useState([]);
  // useEffect(() => {
  const FetchEmissionsByDate = async (from, to) => {
    try {
      const emissions = await axios.get("/api/emissions", {
        params: { from, to },
      });
      const { data } = emissions;
      // Collect unique detail IDs
      const detailIds = [...new Set(data.map((e) => e.detail))];

      // Fetch all details in one go
      const response = await axios.get(
        `/api/details?ids=${detailIds.join(",")}`
      );
      const details = response.data;
      // Merge
      const merged = data.map((e) => ({
        ...e,
        detail: details.find((f) => f._id === e.detail),
      }));

      setEmissions(merged);
      console.log("Fetched emissions:", merged);
    } catch (error) {
      console.error("Error fetching emissions:", error);
    }
  };

  //   // Fetch emissions for the initial date range
  //   FetchEmissionsByDate("2025-07-01", "2025-07-21");
  // }, []);

  return (
    <div>
      <h2>Electricity Emissions (July 2025)</h2>
      <DateInput onDateChange={FetchEmissionsByDate} />
      {/* <ul>
        {emissions.map((entry) => (
          <li key={entry._id}>
            {new Date(entry.date).toLocaleDateString()} - {entry.co2e}
            {entry.co2e_unit}
          </li>
        ))}
      </ul> */}
      {emissions.length > 0 && (
        <div>
          <h3>
            Total Emissions:{" "}
            {emissions.reduce((sum, entry) => sum + entry.co2e, 0)} kg
          </h3>
        </div>
      )}
      <p>
        This dashboard shows the CO₂ emissions from electricity usage over a
        selected date range. Use the date input to filter the data.
      </p>
      <BarGraph data={emissions} />
      <p>
        Note: The data shown is for demonstration purposes and may not reflect
        actual emissions.
      </p>
    </div>
  );
}

export default DashboardElectricity;
