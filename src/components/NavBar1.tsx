import { AppBar,Toolbar,IconButton,Typography,Stack,Button, MenuItem,Menu,Box } from "@mui/material";
import logo from './hspwLogo.png';
import React, { useState } from "react";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import {
  createTheme,
  PaletteColorOptions,
  ThemeProvider,
} from '@mui/material/styles';

export const MuiDrawer = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorEl1, setAnchorEl1] = React.useState(null);
  const [anchorEl2, setAnchorEl2] = React.useState(null);
  const [anchorEl3, setAnchorEl3] = React.useState(null);
  const [anchorEl4, setAnchorEl4] = React.useState(null);
  function handleClick(event) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }
  function handleClick1(event) {
    if (anchorEl1 !== event.currentTarget) {
      setAnchorEl1(event.currentTarget);
    }
  }
  function handleClick2(event) {
    if (anchorEl2 !== event.currentTarget) {
      setAnchorEl2(event.currentTarget);
    }
  }
  function handleClick3(event) {
    if (anchorEl3 !== event.currentTarget) {
      setAnchorEl3(event.currentTarget);
    }
  }
  function handleClick4(event) {
    if (anchorEl4 !== event.currentTarget) {
      setAnchorEl4(event.currentTarget);
    }
  }
  function handleClose() {
    setAnchorEl(null);
  }
  function handleClose1() {
    setAnchorEl1(null);
  }
  function handleClose2() {
    setAnchorEl2(null);
  }
  function handleClose3() {
    setAnchorEl3(null);
  }
  function handleClose4() {
    setAnchorEl4(null);
  }
  return (
    <AppBar position='static' color='transparent' sx={{width:'100%', height:'20%'}}>
      <Toolbar>
      <Box
        component="img"
        sx={{
          height: 240,
          width: 450,
          maxHeight: { xs: 250, md: 150 },
          maxWidth: { xs: 550, md: 650 },
        }}
        alt="The house from the offer."
        src={logo}
      />
        <Stack direction='row' spacing={2} sx={{ml:8}}>
          <Button color="primary" size="large" style={{ fontSize: '22px' }} component="a" href="/">Home</Button>
          <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }} 
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
            onMouseOver={handleClick}>
              Browse
            </Button>
            <Menu 
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            MenuListProps={{ onMouseLeave: handleClose }}>
              <MenuItem onClick={handleClose} component="a" href="/salivary_protein">Salivary proteins</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/protein_cluster">Protein clusters</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/protein_signature">Protein signatures</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/gene">Genes</MenuItem>
              <MenuItem onClick={handleClose} component="a" href="/citation">Citations</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
    <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}
            aria-owns={anchorEl1 ? "simple-menu1" : undefined}
            aria-haspopup="true"
            onClick={handleClick1}
            onMouseOver={handleClick1}>
              Search
            </Button>
            <Menu 
            id="simple-menu1"
            anchorEl={anchorEl1}
            open={Boolean(anchorEl1)}
            onClose={handleClose1}
            MenuListProps={{ onMouseLeave: handleClose1 }}>
              <MenuItem onClick={handleClose1}>Basic search</MenuItem>
              <MenuItem onClick={handleClose1}>Advanced Search</MenuItem>
              <MenuItem onClick={handleClose1}>Semantic search</MenuItem>
              <MenuItem onClick={handleClose1}>Experiment Search</MenuItem>
              <MenuItem onClick={handleClose1}>Protein search by identifiers</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
    <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}
            aria-owns={anchorEl2 ? "simple-menu2" : undefined}
            aria-haspopup="true"
            onClick={handleClick2}
            onMouseOver={handleClick2}>
              Analyze
            </Button>
            <Menu 
            id="simple-menu2"
            anchorEl={anchorEl2}
            open={Boolean(anchorEl2)}
            onClose={handleClose2}
            MenuListProps={{ onMouseLeave: handleClose2 }}>
              <MenuItem onClick={handleClose2}>3D Structure Prediction</MenuItem>
              <MenuItem onClick={handleClose2}>Annotation report</MenuItem>
              <MenuItem onClick={handleClose2}>Multiple sequence alignment</MenuItem>
              <MenuItem onClick={handleClose2}>Differential Expression Analysis</MenuItem>
              <MenuItem onClick={handleClose2}>Protein signature search</MenuItem>
              <MenuItem onClick={handleClose2}>Protein similarity search (BLAST)</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
    <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}
            aria-owns={anchorEl3 ? "simple-menu3" : undefined}
            aria-haspopup="true"
            onClick={handleClick3}
            onMouseOver={handleClick3}>
              Help
            </Button>
            <Menu
            id="simple-menu3"
            anchorEl={anchorEl3}
            open={Boolean(anchorEl3)}
            onClose={handleClose3}
            MenuListProps={{ onMouseLeave: handleClose3 }}>
              <MenuItem onClick={handleClose3}>About</MenuItem>
              <MenuItem onClick={handleClose3}>Contact Us</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
    <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}
            aria-owns={anchorEl4 ? "simple-menu4" : undefined}
            aria-haspopup="true"
            onClick={handleClick4}
            onMouseOver={handleClick4}>
              Team
            </Button>
            <Menu 
             id="simple-menu4"
             anchorEl={anchorEl4}
             open={Boolean(anchorEl4)}
             onClose={handleClose4}
             MenuListProps={{ onMouseLeave: handleClose4 }}>
              <MenuItem onClick={handleClose4}>Current Team</MenuItem>
              <MenuItem onClick={handleClose4}>Founding Team</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
        </Stack>
        
      </Toolbar>
    </AppBar>
  )
}

export default MuiDrawer;
