import React, { useState, useEffect, useContext } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  MenuItem,
  Box,
  useMediaQuery,
  Container,
  Avatar,
} from "@mui/material";
import PopupState, {
  bindTrigger,
  bindMenu,
  bindHover,
} from "material-ui-popup-state";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import { Link, useNavigate, useLocation } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"; // Importing the icon
import logo from "../assets/hspw-logo.png";
import MobileNavBar from "./MobileNavBar";
import { AuthContext, AuthProvider } from "../services/AuthContext"; // Import the logout method

const navMenuStyles = {
  marginRight: "20px",
  fontSize: "20px",
};

export const NavBar = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to track location changes
  const { user, session, logout } = useContext(AuthContext);

  useEffect(() => {
    if (session && session.isValid()) {
      setIsLoggedIn(true);
      console.log("Session validity: ", session.isValid());
      console.log("Access Token: ", session.getAccessToken().getJwtToken());
      console.log("ID Token: ", session.getIdToken().getJwtToken());
      console.log("Refresh Token: ", session.getRefreshToken().getToken());
    } else {
      setIsLoggedIn(false);
    }
  }, [location]); // Run useEffect whenever the location changes

  const handleLogout = async () => {
    try {
      await logout(); // Call the Cognito sign out method
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  console.log("Rendering NavBar with isLoggedIn:", isLoggedIn);

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
                <PopupState popupId="BrowseMenu" variant="popover">
                  {(popupState) => (
                    <>
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
                        <MenuItem component={Link} to="/salivary-protein">
                          Salivary Proteins
                        </MenuItem>
                        <MenuItem component={Link} to="/protein-cluster">
                          Protein Clusters
                        </MenuItem>
                        <MenuItem component={Link} to="/protein-signature">
                          Protein Signatures
                        </MenuItem>
                        <MenuItem component={Link} to="/gene">
                          Genes
                        </MenuItem>
                        <MenuItem component={Link} to="/citation">
                          Publications
                        </MenuItem>
                      </HoverMenu>
                    </>
                  )}
                </PopupState>
                <PopupState popupId="SearchMenu" variant="popover">
                  {(popupState) => (
                    <>
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
                        <MenuItem component={Link} to="/global-search">
                          Global Search
                        </MenuItem>
                        <MenuItem component={Link} to="/advanced-search">
                          Advanced Search
                        </MenuItem>
                        <MenuItem component={Link} to="/experiment-search">
                          Experiment Search
                        </MenuItem>
                        <MenuItem component={Link} to="/protein-set-search">
                          Protein Search By Identifiers
                        </MenuItem>
                      </HoverMenu>
                    </>
                  )}
                </PopupState>
                <PopupState popupId="AnalyzeMenu" variant="popover">
                  {(popupState) => (
                    <>
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
                        <MenuItem component={Link} to="/clustalo">
                          Multiple Sequence Alignment
                        </MenuItem>
                        <MenuItem
                          component={Link}
                          to="/differential-expression"
                        >
                          Differential Expression Analysis
                        </MenuItem>
                        <MenuItem component={Link} to="/iprscan5">
                          Protein Signature Search
                        </MenuItem>
                        <MenuItem component={Link} to="/psiblast">
                          Protein Similarity Search (BLAST)
                        </MenuItem>
                      </HoverMenu>
                    </>
                  )}
                </PopupState>
                <PopupState popupId="HelpMenu" variant="popover">
                  {(popupState) => (
                    <>
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
                        <MenuItem component={Link} to="/about">
                          About
                        </MenuItem>
                        <MenuItem component={Link} to="/download">
                          Download
                        </MenuItem>
                        <MenuItem component={Link} to="/team">
                          Team
                        </MenuItem>
                        <MenuItem component={Link} to="/contact">
                          Contact Us
                        </MenuItem>
                      </HoverMenu>
                    </>
                  )}
                </PopupState>
                {isLoggedIn ? (
                  <PopupState variant="popover" popupId="account-menu">
                    {(popupState) => (
                      <>
                        <Button
                          {...bindTrigger(popupState)}
                          size="large"
                          style={navMenuStyles}
                          startIcon={<Avatar alt="User Avatar" />}
                        >
                          Account
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
                          <MenuItem component={Link} to="/profile">
                            Profile
                          </MenuItem>
                          <MenuItem component={Link} to="/submissions">
                            Submissions
                          </MenuItem>
                          <MenuItem onClick={handleLogout}>Log out</MenuItem>
                        </HoverMenu>
                      </>
                    )}
                  </PopupState>
                ) : (
                  <Button
                    color="primary"
                    size="large"
                    style={navMenuStyles}
                    component={Link}
                    to="/login"
                  >
                    Log in
                  </Button>
                )}
              </>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Container>
  );
};

export default NavBar;
