import {
  AppBar,
  Toolbar,
  Button,
  MenuItem,
  Box,
  useMediaQuery,
  Container,
} from "@mui/material";
import logo from "../assets/hspw-logo.png";
import React from "react";
import PopupState from "material-ui-popup-state";
import { bindHover, bindMenu } from "material-ui-popup-state/hooks";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import { ArrowDropDownIcon } from "@mui/x-date-pickers";
import MobileNavBar from "./MobileNavBar";
import { Link } from "react-router-dom";

const navMenuStyles = {
  marginRight: "20px",
  fontSize: "20px",
};

export const NavBar = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));

  return (
    <Container maxWidth="xl">
      <AppBar
        position="static"
        color="transparent"
        sx={{
          marginTop: "15px",
          marginBottom: "15px",
          width: "100%",
          boxShadow: "none",
        }}
      >
        <Toolbar style={{ padding: 0 }}>
          <Link to="/">
            <Box
              component="img"
              sx={{
                height: 160,
                width: 300,
                maxHeight: { xs: 100, md: 100 },
                maxWidth: { xs: 440, md: 440 },
              }}
              src={logo}
            />
          </Link>
          <div
            style={{
              display: "flex",
              justifyContent: "right",
              width: "100%",
            }}
          >
            {isMobile ? (
              <MobileNavBar />
            ) : (
              <>
                <Button
                  color="primary"
                  size="large"
                  style={navMenuStyles}
                  component={Link}
                  to="/"
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
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem
                          component={Link}
                          to="/salivary-protein"
                        >
                          Salivary Proteins
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/protein-cluster"
                        >
                          Protein Clusters
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/protein-signature"
                        >
                          Protein Signatures
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/gene"
                        >
                          Genes
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/citation"
                        >
                          Publications
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
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem
                          component={Link}
                          to="/global-search"
                        >
                          Global Search
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/advanced-search"
                        >
                          Advanced Search
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/experiment-search"
                        >
                          Experiment Search
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/protein-set-search"
                        >
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
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem
                          component={Link}
                          to="/clustalo"
                        >
                          Multiple Sequence Alignment
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/differential-expression"
                        >
                          Differential Expression Analysis
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/iprscan5"
                        >
                          Protein Signature Search
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/psiblast"
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
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "left",
                        }}
                        transformOrigin={{
                          vertical: "top",
                          horizontal: "left",
                        }}
                      >
                        <MenuItem
                          component={Link}
                          to="/about"
                        >
                          About
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/doc/"
                        >
                          Documentation
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/download"
                        >
                          Download
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/team"
                        >
                          Team
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/contact"
                        >
                          Contact Us
                        </MenuItem>
                      </HoverMenu>
                    </React.Fragment>
                  )}
                </PopupState>
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default NavBar;
