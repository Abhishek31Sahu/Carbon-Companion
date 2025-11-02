import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ElectricityData from "./pages/electricitydata";
import Dashboard from "./pages/Dashboard";
import FoodEmission from "./pages/foodEmission";
import CalcByFuel from "./pages/travelEmission/calcByFUEL";
import CalcByDistance from "./pages/travelEmission/calcByDIST";
import FlightPage from "./pages/travelEmission/flight";
import GPSTracker from "./pages/liveTracker";
import TRY from "./pages/signinpage";
import NewUser from "./pages/Signuppage";
import CarbonCalculator from "./components/Caltravelemission";
import Home from "./components/Home";
import SolutionFoodEmission from "./pages/SolutionFoodEmission";
import MapWithResult from "./components/map/mapwithresult";
import Visualization from "./pages/Visualization";
import PhoneNumberLogin from "./components/PhoneNumberLogin";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/electricity" element={<ElectricityData />} />
        <Route path="/electricity/emission" element={<Dashboard />} />
        <Route path="/food" element={<FoodEmission />} />
        <Route path="/food/emission" element={<SolutionFoodEmission />} />
        <Route path="/fuel-consumption" element={<CalcByFuel />} />
        <Route path="/travel/distance" element={<CalcByDistance />} />
        <Route path="/travel/flight" element={<FlightPage />} />
        <Route path="/live-emission" element={<GPSTracker />} />
        <Route path="/login" element={<TRY />} />
        <Route path="/login/phoneNumber" element={<PhoneNumberLogin />} />
        <Route path="/signup" element={<NewUser />} />
        <Route path="/CarbonCalculator" element={<CarbonCalculator />} />
        <Route path="/live-emission/map" element={<MapWithResult />} />
        <Route path="/dashboard" element={<Visualization />} />
      </Routes>
    </Router>
  );
}

export default App;
