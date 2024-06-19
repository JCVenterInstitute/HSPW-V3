import { Box, Button, Grid, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const downloadMapping = {
  "Volcano Plot": "volcano_0_dpi72.png",
  "Volcano Data": "volcano.csv",
  "Top 25 Samples Heatmap": "heatmap_1_dpi72.png",
  "All Samples Heatmap": "heatmap_0_dpi72.png",
  "Statistical Parametric Test Plot": "tt_0_dpi72.png",
  "Statistical Parametric Test Data": "statistical_parametric_test.csv",
  "Fold Change Analysis Plot": "fc_0_dpi72.png",
  "Fold Change Analysis Data": "fold_change.csv",
  "Principal Component Analysis Plot": "pca_score2d_0_dpi72.png",
  "Principal Component Analysis Data": "pca_score.csv",
  "Venn-Diagram Plot": "venn-dimensions.png",
  "Venn-Diagram Data": "venn_out_data.txt",
  "Normalization Plot": "norm_0_dpi72.png",
  "Normalization Data": "data_normalized.csv",
  "Input Data": "data_original.csv",
  "Random Forest CLS": "rf_cls_0_dpi72.png",
  "Random Forest IMP": "rf_imp_0_dpi72.png",
  "Random Forest Outlier": "rf_outlier_0_dpi72.png",
  "GO Biological Process": "",
  "GO Molecular Function": "",
  "GO Cellular Component": "",
  "KEGG Pathway/Module": "",
  "Result Data": "all_data.tsv",
  "All Data Set": "data_set.zip",
};

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
