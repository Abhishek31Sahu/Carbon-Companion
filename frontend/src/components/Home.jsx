import React from "react";
import { Link } from "react-router-dom";
import LogOut from "./logout";
import { Button } from "@mui/material";
function Home() {
  return (
    <div>
      <h1>Home</h1>
      <Button component={Link} to="/login" variant="contained" color="primary">
        Sign In
      </Button>

      <Button component={Link} to="/signup" variant="contained" color="primary">
        Sign Up
      </Button>
      <LogOut />
    </div>
  );
}

export default Home;
