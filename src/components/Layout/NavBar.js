import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppBar, Toolbar, Box, useMediaQuery, Container } from "@mui/material";

import { AuthContext } from "../../services/AuthContext"; // Import the logout method
import logo from "@Assets/logo/hspw-logo.png";
import MobileNavBar from "./MobileNavBar";
import NavBarMenuItem from "./NavBarButton";
import { menuData } from "../../data/navbarData";

export const NavBar = () => {
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("lg"));
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to track location changes
  const { session, logout } = useContext(AuthContext);

  useEffect(() => {
    if (session && session.isValid()) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location, session]); // Run useEffect whenever the location changes

  const handleLogout = async () => {
    try {
      await logout(); // Call the Cognito sign out method
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
                {menuData.map((m, i) => {
                  return (
                    <NavBarMenuItem
                      key={`navbar-item-${i}`}
                      mainMenu={m.mainMenu}
                      subMenu={m.subMenu}
                    />
                  );
                })}
                {isLoggedIn ? (
                  <NavBarMenuItem
                    mainMenu={{ label: "Account" }}
                    subMenu={[
                      {
                        link: "/profile",
                        label: "Profile",
                      },
                      {
                        link: "/submissions",
                        label: "Submissions",
                      },
                      {
                        link: "/workspace",
                        label: "Workspace",
                      },
                      {
                        link: "/",
                        label: "Log Out",
                        onClick: handleLogout,
                      },
                    ]}
                  />
                ) : (
                  <NavBarMenuItem
                    mainMenu={{ label: "Login", link: "/login" }}
                  />
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
