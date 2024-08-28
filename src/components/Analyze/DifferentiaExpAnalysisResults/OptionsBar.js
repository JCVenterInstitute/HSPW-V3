import { Box, Typography } from "@mui/material";

import { option } from "./Constants";

const OptionsBar = ({ selectedSection, setSelectedSection }) => {
  const customStyle = {
    box: {
      backgroundColor: "#f9f8f7",
      width: "270px",
      height: "auto",
    },
    typography: {
      color: "#454545",
      fontFamily: "Montserrat",
      marginTop: "5px",
      fontSize: "14px",
      padding: "10px",
      borderRadius: "16px",
      transition: "0.3s",
      "&:hover": {
        backgroundColor: "#D9D9D9",
        cursor: "pointer",
      },
    },
  };

  return (
    <Box sx={customStyle.box}>
      <Box sx={{ p: 4, borderRadius: "16px", width: "100%" }}>
        {option.map((item, index) => (
          <Typography
            key={index}
            sx={{
              ...customStyle.typography,
              ...(selectedSection === item && {
                backgroundColor: "#C9C9C9",
              }),
            }}
            onClick={() => setSelectedSection(item)}
          >
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default OptionsBar;
