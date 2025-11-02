// 🧩 Function to group emissions by date
function groupEmissionsByDate(emissions) {
  const grouped = emissions.reduce((acc, entry) => {
    // Convert to date-only string (ignore time)
    const dateKey = new Date(entry.date).toISOString().split("T")[0];

    // If this date not seen yet, start with 0
    if (!acc[dateKey]) {
      acc[dateKey] = 0;
    }

    // Add CO2e for this date
    acc[dateKey] += entry.co2e;
    return acc;
  }, {});

  // Convert back to array form for chart.js
  return Object.entries(grouped).map(([date, total]) => ({
    date,
    co2e: total,
  }));
}

export default groupEmissionsByDate;
