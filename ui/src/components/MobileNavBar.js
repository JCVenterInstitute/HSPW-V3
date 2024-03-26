import {
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Link } from "react-router-dom";

const MobileNavBar = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
      >
        <MenuIcon fontSize="large" />
      </IconButton>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <List>
          {/* Home Menu Item */}
          <ListItem disablePadding>
            <ListItemButton
              component={Link}
              to="/"
            >
              <ListItemText primary="Home" />
            </ListItemButton>
          </ListItem>

          {/* Browse Menu Item with Sub-Options */}
          <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Browse</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                component="div"
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  to="/salivary-protein"
                >
                  <ListItemText primary="Salivary Proteins" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/protein-cluster"
                >
                  <ListItemText primary="Protein Clusters" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/protein-signature"
                >
                  <ListItemText primary="Protein Signatures" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/gene"
                >
                  <ListItemText primary="Genes" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/citation"
                >
                  <ListItemText primary="Citations" />
                </ListItemButton>
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Search Menu Item with Sub-Options */}
          <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Search</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                component="div"
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  to="/global-search"
                >
                  <ListItemText primary="Global Search" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/advanced-search"
                >
                  <ListItemText primary="Advanced Search" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/experiment-search"
                >
                  <ListItemText primary="Experiment Search" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/protein-set-search"
                >
                  <ListItemText primary="Protein Search By Identifiers" />
                </ListItemButton>
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Analyze Menu Item with Sub-Options */}
          <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Analyze</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                component="div"
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  to="/clustalo"
                >
                  <ListItemText primary="Multiple Sequence Alignment" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/differential-expression"
                >
                  <ListItemText primary="Differential Expression Analysis" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/iprscan5"
                >
                  <ListItemText primary="Protein Signature Search" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/psiblast"
                >
                  <ListItemText primary="Protein Similarity Search (BLAST)" />
                </ListItemButton>
              </List>
            </AccordionDetails>
          </Accordion>

          {/* Help Menu Item with Sub-Options */}
          <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>Help</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List
                component="div"
                disablePadding
              >
                <ListItemButton
                  component={Link}
                  to="/about"
                >
                  <ListItemText primary="About" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/download"
                >
                  <ListItemText primary="Download" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/team"
                >
                  <ListItemText primary="Team" />
                </ListItemButton>
                <ListItemButton
                  component={Link}
                  to="/contact"
                >
                  <ListItemText primary="Contact Us" />
                </ListItemButton>
              </List>
            </AccordionDetails>
          </Accordion>
        </List>
      </Drawer>
    </>
  );
};

export default MobileNavBar;
