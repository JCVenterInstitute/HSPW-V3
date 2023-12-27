import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { menu } from "./menu";
import { hasChildren } from "../utils";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { ReactComponent as Search } from "../table_icon/search.svg";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function Filter_Protein() {
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
    <>
      <ListItem button>
        <ListItemText primary={item.title} />
      </ListItem>
      <div>
        {item.title == "Uniprot Accession" && (
          <form style={{ display: "inline", position: "relative" }}>
            <input
              type="text"
              id="filter-text-box"
              placeholder="Search..."
              style={{
                width: "70%",
                marginLeft: "10px",
                padding: "0.25rem 0.75rem",
                borderRadius: "10px 0 0 10px",
                borderColor: "#1463B9",
                display: "inline",
                position: "relative",
              }}
            />
            <button
              type="submit"
              style={{
                display: "inline",
                position: "relative",
                top: "0.3em",
                backgroundColor: "#1463B9",
                borderColor: "#1463B9",
                cursor: "pointer",
                width: "15%",
                borderRadius: "0 10px 10px 0",
              }}
            >
              <Search />
            </button>
          </form>
        )}
      </div>
      <div>
        {item.title == "Gene Symbol" && (
          <form style={{ display: "inline", position: "relative" }}>
            <input
              type="text"
              id="filter-text-box"
              placeholder="Search..."
              style={{
                width: "70%",
                marginLeft: "10px",
                padding: "0.25rem 0.75rem",
                borderRadius: "10px 0 0 10px",
                borderColor: "#1463B9",
                display: "inline",
                position: "relative",
              }}
            />
            <button
              type="submit"
              style={{
                display: "inline",
                position: "relative",
                top: "0.3em",
                backgroundColor: "#1463B9",
                borderColor: "#1463B9",
                cursor: "pointer",
                width: "15%",
                borderRadius: "0 10px 10px 0",
              }}
            >
              <Search />
            </button>
          </form>
        )}
      </div>
      <div>
        {item.title == "Protein Name" && (
          <form style={{ display: "inline", position: "relative" }}>
            <input
              type="text"
              id="filter-text-box"
              placeholder="Search..."
              style={{
                width: "70%",
                marginLeft: "10px",
                padding: "0.25rem 0.75rem",
                borderRadius: "10px 0 0 10px",
                borderColor: "#1463B9",
                display: "inline",
                position: "relative",
              }}
            />
            <button
              type="submit"
              style={{
                display: "inline",
                position: "relative",
                top: "0.3em",
                backgroundColor: "#1463B9",
                borderColor: "#1463B9",
                cursor: "pointer",
                width: "15%",
                borderRadius: "0 10px 10px 0",
              }}
            >
              <Search />
            </button>
          </form>
        )}
      </div>
    </>
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
        {open ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        <ListItemText primary={item.title} />
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
