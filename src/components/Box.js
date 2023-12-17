import { experimentalStyled as styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import { ListItemText, Typography, ListItem } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  border: "1px",
}));

export default function AutoGrid() {
  return (
    <Box
      sx={{ flexGrow: 2 }}
      bgcolor="common.yellow"
    >
      <Grid>
        <Item>
          <Typography
            variant="h5"
            gutterBottom
          >
            Recent News
          </Typography>
          <ListItem style={{ display: "list-item" }}>
            <ListItemText>
              Bookmark our new URL: https://salivaryproteome.org/
            </ListItemText>
          </ListItem>
          <ListItem style={{ display: "list-item" }}>
            <ListItemText>
              Our new JCVI covid-19 data is available.
            </ListItemText>
          </ListItem>
        </Item>
      </Grid>
    </Box>
  );
}
