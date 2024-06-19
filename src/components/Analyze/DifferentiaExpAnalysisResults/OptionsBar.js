import { Box, Typography } from "@mui/material";

const OptionsBar = ({ selectedSection, option, handleSelect }) => {
  const customStyle = {
    box: {
      backgroundColor: "#f9f8f7",
      width: "270px",
      height: "auto",
    },
    typography: {
      color: "#454545",
      fontFamily: "Montserrat",
      textAlign: "left",
      marginTop: "10px",
      fontSize: "16px",
      padding: "12px 15px 12px 15px",
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
            onClick={() => handleSelect(item)}
          >
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default OptionsBar;
