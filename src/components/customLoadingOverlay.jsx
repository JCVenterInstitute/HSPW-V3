import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
export default () => {
  return (
    <div className="ag-overlay-loading-center">
      <CircularProgress variant="determinate" />
    </div>
  );
};
