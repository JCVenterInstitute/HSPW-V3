import main_feature from "../../components/hero.jpeg";
import { Container, Box, Typography } from "@mui/material";

const DifferentialExpressionResults = () => {
  return (
    <>
      <div style={{ backgroundImage: `url(${main_feature})` }}>
        <h1
          style={{
            color: "white",
            display: "left",
            marginLeft: "20px",
            marginBottom: "1rem",
            paddingTop: "25px",
            paddingLeft: "40px",
          }}
        >
          Differential Expression Analysis Results
        </h1>
        <p
          style={{
            textAlign: "left",
            color: "white",
            fontSize: "18px",
            paddingBottom: "25px",
            marginLeft: "20px",
            marginRight: "20px",
            paddingLeft: "40px",
            paddingRight: "40px",
          }}
        >
          Visual analytics will identify proteins with differential abundance
          between experiments in Groups A and B based on their normalized
          spectral counts.
        </p>
      </div>
      <Container
        maxWidth="false"
        sx={{
          width: "100%",
          display: "flex",
          paddingLeft: "0px !important",
          // paddingRight: "0px !important",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f9f8f7",
            width: "250px",
            height: "1200px",
          }}
        >
          <Box sx={{ m: 2, borderRadius: "16px" }}>
            <Typography
              sx={{
                color: "#454545",
                fontFamily: "Montserrat",
                display: "center",
                textAlign: "center",
                paddingTop: "30px",
              }}
            >
              Valcano Plot
            </Typography>
          </Box>
        </Box>
        <Container maxWidth="xl" sx={{ marginTop: "30px" }}>
          <Box sx={{ display: "flex" }}>
            <Box
              style={{ display: "flex", width: "100%", maxWidth: "550px" }}
            ></Box>
            <Box
              sx={{
                textAlign: "right",
                justifyContent: "flex-end", // To push content to the right
                flexGrow: 1, // To make the right Box occupy remaining space
              }}
            ></Box>
          </Box>
        </Container>
      </Container>
    </>
  );
};
export default DifferentialExpressionResults;
