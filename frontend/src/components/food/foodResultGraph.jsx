import ShinyBarChartHorizontal from "../../graphBoth";
import { useLocation } from "react-router-dom";
export default function FoodResultGraph() {
  const location = useLocation();
  const { dataset } = location.state || {};
  return (
    <div>
      <ShinyBarChartHorizontal dataset={dataset} />
    </div>
  );
}
