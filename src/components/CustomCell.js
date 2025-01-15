// CustomCell.js
import React from "react";
import { Box } from "@mui/material";

const CustomCell = ({ value, children }) => {
  return (
    <Box
      sx={{
        padding: "20px !important", // Force padding with inline styles
        display: "flex",
        alignItems: "center",
        height: "100%",
      }}
    >
      {children || value}
    </Box>
  );
};

export default CustomCell;
