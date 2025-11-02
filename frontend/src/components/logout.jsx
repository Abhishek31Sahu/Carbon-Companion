import { Button } from "@mui/material";
import React from "react";
import { useEmissionStore } from "../emissionStore";
function LogOut() {
  const handleLogOut = () => {
    useEmissionStore.persist.clearStorage();
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
  };

  return (
    <Button variant="contained" color="primary" onClick={handleLogOut}>
      Logout
    </Button>
  );
}

export default LogOut;
