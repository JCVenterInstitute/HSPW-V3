import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import filter from "../assets/icon-filtering.png";
import volcano from "../assets/icon-volcano-plot.png";
import rank from "../assets/icon-ranking.png";
import heatmap from "../assets/icon-heatmap.png";
import normalize from "../assets/icon-normalization.png";
import network from "../assets/icon-network-analysis.png";
import { Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  border: "1px",
}));

const gridContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
};

export default function AutoGrid() {
  return (
    <Box sx={{ flexGrow: 2, ml: 25 }}>
      <Grid
        container
        direction="row"
        spacing={10}
        p={2}
        display="flex"
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid
          xs={3}
          md={3}
          display="flex"
        >
          <Item>
            <img
              src={filter}
              display="flex"
              width="90%"
              height="40%"
            />
            <Typography
              variant="h5"
              gutterBottom
            >
              Improve quality of raw data collected from various sources
            </Typography>
            <Divider sx={{ pb: 5 }} />
            <Button
              variant="text"
              href=""
              sx={{ fontSize: 20 }}
            >
              Filtering
            </Button>
          </Item>
        </Grid>
        <Grid
          xs={3}
          md={3}
          display="flex"
        >
          <Item>
            <img
              src={normalize}
              display="flex"
              width="90%"
              height="40%"
            />
            <Typography
              variant="h5"
              gutterBottom
            >
              Adjust values measured on different scales to a notionally common
              scale
            </Typography>
            <Divider sx={{ pb: 1 }} />
            <Button
              variant="text"
              href=""
              sx={{ fontSize: 20 }}
            >
              Normalization
            </Button>
          </Item>
        </Grid>
        <Grid
          xs={3}
          md={3}
          display="flex"
        >
          <Item>
            <img
              src={heatmap}
              display="flex"
              width="90%"
              height="40%"
            />
            <Typography
              variant="h5"
              gutterBottom
            >
              Shows the correlation of protein abundance between two sets.
            </Typography>
            <Divider sx={{ pb: 5 }} />
            <Button
              variant="text"
              href=""
              sx={{ fontSize: 20 }}
            >
              Heatmap
            </Button>
          </Item>
        </Grid>
      </Grid>
      <Grid
        container
        direction="row"
        spacing={10}
        p={2}
        display="flex"
      >
        <Grid
          xs={3}
          md={3}
          display="flex"
        >
          <Item>
            <img
              src={rank}
              display="flex"
              width="90%"
              height="40%"
            />
            <Typography
              variant="h5"
              gutterBottom
            >
              Use ranking scores to find the correlation of protein abundance
              between two sets.
            </Typography>
            <Divider sx={{ pb: 1 }} />
            <Button
              variant="text"
              href=""
              sx={{ fontSize: 20 }}
            >
              Ranking
            </Button>
          </Item>
        </Grid>
        <Grid
          xs={3}
          md={3}
          display="flex"
        >
          <Item>
            <img
              src={volcano}
              display="flex"
              width="90%"
              height="40%"
            />
            <Typography
              variant="h5"
              gutterBottom
            >
              Shows the difference in protein abundance between samples in
              Groups A and B.{" "}
            </Typography>
            <Divider sx={{ pb: 1 }} />
            <Button
              variant="text"
              href=""
              sx={{ fontSize: 20 }}
            >
              Volcano Plot
            </Button>
          </Item>
        </Grid>
        <Grid
          xs={3}
          md={3}
          display="flex"
        >
          <Item>
            <img
              src={network}
              display="flex"
              width="90%"
              height="40%"
            />
            <Typography
              variant="h5"
              gutterBottom
            >
              Find correlated protein in our dataset.
            </Typography>
            <Divider sx={{ pb: 9 }} />
            <Button
              variant="text"
              href=""
              sx={{ fontSize: 20 }}
            >
              Network Analysis
            </Button>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}
