import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Alert, Box } from "@mui/material";

const NotFoundPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/"); // Redirects to the home page
    }, 3000);

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, [navigate]);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "45vh",
      }}
    >
      <Alert
        sx={{
          fontSize: "30px",
          "& .MuiAlert-icon": {
            fontSize: 40,
          },
        }}
        severity="error"
      >
        <strong>404 - Not Found</strong>
        <br />
        Sorry, the page you are looking for does not exist.
      </Alert>
    </Box>
  );
};

export default NotFoundPage;
