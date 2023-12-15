import { AppBar, Toolbar, Stack, Button, MenuItem, Box } from "@mui/material";
import logo from "../components/hspwLogo.png";
import React from "react";
import PopupState from "material-ui-popup-state";
import { bindHover, bindMenu } from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";

const navMenuStyles = {
  marginRight: "45px",
  fontSize: "22px",
};

export const NavBar = () => {
  return (
    <AppBar
      position="static"
      color="transparent"
      sx={{ width: "100%", height: "20%" }}
    >
      <Toolbar style={{ justifyContent: "space-between" }}>
        <Box
          component="img"
          sx={{
            height: 240,
            width: 450,
            maxHeight: { xs: 250, md: 150 },
            maxWidth: { xs: 550, md: 650 },
          }}
          src={logo}
        />
        <Stack
          direction="row"
          spacing={2}
          sx={{ ml: 8 }}
        >
          <Button
            color="primary"
            size="large"
            style={navMenuStyles}
            component="a"
            href="/"
          >
            Home
          </Button>
          <PopupState
            popupId="BrowseMenu"
            variant="popover"
          >
            {(popupState) => (
              <React.Fragment>
                <Button
                  size="large"
                  style={navMenuStyles}
                  {...bindHover(popupState)}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Browse
                </Button>
                <HoverMenu
                  {...bindMenu(popupState)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem
                    onClick={popupState.close}
                    component="a"
                    href="/salivary_protein"
                  >
                    Salivary Proteins
                  </MenuItem>
                  <MenuItem
                    onClick={popupState.close}
                    component="a"
                    href="/protein_cluster"
                  >
                    Protein Clusters
                  </MenuItem>
                  <MenuItem
                    onClick={popupState.close}
                    component="a"
                    href="/protein_signature"
                  >
                    Protein Signatures
                  </MenuItem>
                  <MenuItem
                    onClick={popupState.close}
                    component="a"
                    href="/gene"
                  >
                    Genes
                  </MenuItem>
                  <MenuItem
                    onClick={popupState.close}
                    component="a"
                    href="/citation"
                  >
                    Citations
                  </MenuItem>
                </HoverMenu>
              </React.Fragment>
            )}
          </PopupState>
          <PopupState
            popupId="SearchMenu"
            variant="popover"
          >
            {(popupState) => (
              <React.Fragment>
                <Button
                  variant="text"
                  size="large"
                  style={navMenuStyles}
                  {...bindHover(popupState)}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Search
                </Button>
                <HoverMenu
                  {...bindMenu(popupState)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem
                    onClick={popupState.close}
                    component="a"
                    href="/advanced-search"
                  >
                    Advanced Search
                  </MenuItem>
                  <MenuItem onClick={popupState.close}>
                    Semantic Search
                  </MenuItem>
                  <MenuItem onClick={popupState.close}>
                    Experiment Search
                  </MenuItem>
                  <MenuItem onClick={popupState.close}>
                    Protein Search By Identifiers
                  </MenuItem>
                </HoverMenu>
              </React.Fragment>
            )}
          </PopupState>
          <PopupState
            popupId="AnalyzeMenu"
            variant="popover"
          >
            {(popupState) => (
              <React.Fragment>
                <Button
                  size="large"
                  style={navMenuStyles}
                  {...bindHover(popupState)}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Analyze
                </Button>
                <HoverMenu
                  {...bindMenu(popupState)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem>Annotation Report</MenuItem>
                  <MenuItem
                    component="a"
                    href="/clustalo"
                  >
                    Multiple Sequence Alignment
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/differential-expression"
                  >
                    Differential Expression Analysis
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/iprscan5"
                  >
                    Protein Signature Search
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/psiblast"
                  >
                    Protein Similarity Search (BLAST)
                  </MenuItem>
                </HoverMenu>
              </React.Fragment>
            )}
          </PopupState>
          <PopupState
            popupId="HelpMenu"
            variant="popover"
          >
            {(popupState) => (
              <React.Fragment>
                <Button
                  size="large"
                  style={navMenuStyles}
                  {...bindHover(popupState)}
                  endIcon={<ArrowDropDownIcon />}
                >
                  Help
                </Button>
                <HoverMenu
                  {...bindMenu(popupState)}
                  anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  transformOrigin={{ vertical: "top", horizontal: "left" }}
                >
                  <MenuItem
                    component="a"
                    href="/About"
                  >
                    About
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/download"
                  >
                    Download
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/download"
                  >
                    Team
                  </MenuItem>
                  <MenuItem>Contact Us</MenuItem>
                </HoverMenu>
              </React.Fragment>
            )}
          </PopupState>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
