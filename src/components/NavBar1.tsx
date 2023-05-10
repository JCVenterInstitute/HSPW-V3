import { AppBar,Toolbar,IconButton,Typography,Stack,Button, MenuItem,Menu,Box } from "@mui/material";
import logo from './hspw_logo.png';
import React, { useState } from "react";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import {
  createTheme,
  PaletteColorOptions,
  ThemeProvider,
} from '@mui/material/styles';

export const MuiDrawer = () => {
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
            <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}>
              Browse
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close} component="a" href="/salivary_protein">Salivary proteins</MenuItem>
              <MenuItem onClick={popupState.close} component="a" href="/protein_cluster">Protein clusters</MenuItem>
              <MenuItem onClick={popupState.close} component="a" href="/protein_signature">Protein signatures</MenuItem>
              <MenuItem onClick={popupState.close} component="a" href="/gene">Genes</MenuItem>
              <MenuItem onClick={popupState.close} component="a" href="/citation">Citations</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
    <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}>
              Search
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>Basic search</MenuItem>
              <MenuItem onClick={popupState.close}>Advanced Search</MenuItem>
              <MenuItem onClick={popupState.close}>Semantic search</MenuItem>
              <MenuItem onClick={popupState.close}>Experiment Search</MenuItem>
              <MenuItem onClick={popupState.close}>Protein search by identifiers</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
    <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}>
              Analyze
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>3D Structure Prediction</MenuItem>
              <MenuItem onClick={popupState.close}>Annotation report</MenuItem>
              <MenuItem onClick={popupState.close}>Multiple sequence alignment</MenuItem>
              <MenuItem onClick={popupState.close}>Differential Expression Analysis</MenuItem>
              <MenuItem onClick={popupState.close}>Protein signature search</MenuItem>
              <MenuItem onClick={popupState.close}>Protein similarity search (BLAST)</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
    <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}>
              Help
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>About</MenuItem>
              <MenuItem onClick={popupState.close}>Contact Us</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>
    <PopupState variant="popover" popupId="demo-popup-menu" sx={{ml:5}}>
          {(popupState) => (
            <React.Fragment>
            <Button {...bindTrigger(popupState)} endIcon={<KeyboardArrowDownIcon />} style={{ fontSize: '20px' }}>
              Team
            </Button>
            <Menu {...bindMenu(popupState)}>
              <MenuItem onClick={popupState.close}>Current Team</MenuItem>
              <MenuItem onClick={popupState.close}>Founding Team</MenuItem>
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
