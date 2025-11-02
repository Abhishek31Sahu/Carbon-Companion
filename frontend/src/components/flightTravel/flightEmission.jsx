import axios from "axios";
import FlightValue from "./flightValue";
import DecideResult from "../byDist-TravelEmission/DecideResult";
import Footer from "../byDist-TravelEmission/footer";
import TopHeading from "../byDist-TravelEmission/heading";

function FlightAPI() {
  const handleFlightSubmit = async (data) => {
    await axios
      .post("/api/travel-emission/flight", data, {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        console.log("Flight Emission Data:", response.data);
      })
      .catch((error) => {
        console.error("Error submitting flight data:", error);
      });
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
        <FlightValue onSumbit={handleFlightSubmit} />
        <DecideResult id={"/travel/flight"} />
      </div>
      <Footer />
    </div>
  );
}

export default FlightAPI;
