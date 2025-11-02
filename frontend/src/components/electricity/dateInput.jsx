import { useState } from "react";
import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";

function DateInput({ onDateChange }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onDateChange(startDate, endDate);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Select Date Range</h3>
      <p>Choose a date range to view emissions data.</p>
      <TextField
        type="date"
        value={startDate}
        label="Start Date"
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setStartDate(e.target.value)}
      />
      &nbsp;&nbsp;
      <TextField
        type="date"
        value={endDate}
        label="End Date"
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <br />
      <br />
      <Button type="submit" variant="contained" color="primary">
        Update
      </Button>
    </form>
  );
}
export default DateInput;
