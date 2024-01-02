import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { menu } from "./Menu1.js";
import { hasChildren } from "./utils.js";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

export default function AnalysisFilter() {
  return menu.map((item, key) => (
    <MenuItem
      key={key}
      item={item}
    />
  ));
}

const MenuItem = ({ item }) => {
  const Component = hasChildren(item) ? MultiLevel : SingleLevel;
  return <Component item={item} />;
};

const SingleLevel = ({ item }) => {
  return (
    <ListItem button>
      <ListItemText primary={item.title} />
    </ListItem>
  );
};

const MultiLevel = ({ item }) => {
  const { items: children } = item;
  console.log(item);
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen((prev) => !prev);
  };

  return (
    <React.Fragment>
      <ListItem
        button
        onClick={handleClick}
        divider="true"
      >
        <ListItemText primary={item.title} />
        {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </ListItem>
      <div>
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
        >
          <List
            component="div"
            disablePadding
            sx={{ border: "1px groove" }}
          >
            {children.map((child, key) => (
              <FormGroup sx={{ ml: "10px" }}>
                <FormControlLabel
                  control={<Checkbox />}
                  label={child.title}
                />
              </FormGroup>
            ))}
          </List>
        </Collapse>
      </div>
    </React.Fragment>
  );
};
