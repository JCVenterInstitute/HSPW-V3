import { Box, Button, Grid, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

import { downloadMapping } from "../Constants";

const ResultDownload = ({ handleDownload, jobId }) => {
  const style = {
    header: { fontFamily: "Montserrat" },
    container: {
      backgroundColor: "#f9f8f7",
      mt: "20px",
      borderRadius: "16px",
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
      padding: "25px",
    },
    buttonStyle: {
      textDecoration: "underline",
      color: "#1463B9",
    },
  };

  return (
    <Box sx={{ width: "80%" }}>
      <Typography
        variant="h5"
        sx={style.header}
        gutterBottom
      >
        Download
      </Typography>
      <Box sx={style.container}>
        <Grid
          container
          spacing={2}
        >
          <Grid
            item
            xs={12}
          >
            <Box sx={{ ml: 3 }}>
              <Button
                onClick={() => handleDownload(jobId, "data_set.zip")}
                startIcon={<DownloadIcon />}
                sx={{
                  textTransform: "none",
                }}
              >
                <Typography
                  variant="h6"
                  sx={style.buttonStyle}
                >
                  Download All Data Set (.zip)
                </Typography>
              </Button>
            </Box>
          </Grid>
          {Object.entries(downloadMapping).map(([key, fileName]) => {
            return fileName !== "data_set.zip" ? (
              <Grid
                item
                xs={6}
                key={key}
              >
                <Box sx={{ ml: 3 }}>
                  <Button
                    onClick={() => handleDownload(jobId, fileName)}
                    startIcon={<DownloadIcon />}
                    sx={{
                      textTransform: "none",
                    }}
                  >
                    <Typography sx={style.buttonStyle}>{key}</Typography>
                  </Button>
                </Box>
              </Grid>
            ) : null;
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ResultDownload;
