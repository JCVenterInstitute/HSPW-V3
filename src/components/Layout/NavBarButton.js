import React from "react";
import { Button, MenuItem } from "@mui/material";
import PopupState, { bindMenu, bindHover } from "material-ui-popup-state";
import HoverMenu from "material-ui-popup-state/HoverMenu";
import { Link } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const NavBarMenuItem = ({ mainMenu, subMenu }) => {
  const styles = {
    navMenu: {
      marginRight: "20px",
      fontSize: "20px",
    },
  };

  return (
    <>
      {!subMenu ? (
        <Button
          color="primary"
          size="large"
          style={styles.navMenu}
          component={Link}
          to={mainMenu.link}
        >
          {mainMenu.label}
        </Button>
      ) : (
        <PopupState
          popupId={`${mainMenu.label}-menu`}
          variant="popover"
        >
          {(popupState) => (
            <>
              <Button
                size="large"
                style={styles.navMenu}
                {...bindHover(popupState)}
                endIcon={<ArrowDropDownIcon />}
                to={mainMenu?.link}
              >
                {mainMenu.label}
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
                {subMenu.map((m, i) => {
                  return (
                    <MenuItem
                      key={`${m.label}-${i}`}
                      component={Link}
                      to={m.link}
                      onClick={m.onClick}
                    >
                      {m.label}
                    </MenuItem>
                  );
                })}
              </HoverMenu>
            </>
          )}
        </PopupState>
      )}
    </>
  );
};

export default NavBarMenuItem;
