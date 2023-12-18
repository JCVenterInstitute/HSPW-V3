import React from "react";
import { useState, useMemo, useEffect } from "react";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import { Typography } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

function not(a, b) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a, b) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function SelectAllTransferList({
  properties,
  selectedProperties,
  onSelectedPropertiesChange,
}) {
  const [checked, setChecked] = useState([]);
  const [left, setLeft] = useState(properties);
  const [right, setRight] = useState(selectedProperties);
  const [leftSearch, setLeftSearch] = useState("");
  const [rightSearch, setRightSearch] = useState("");

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const filteredLeft = useMemo(
    () =>
      left.filter((item) =>
        item.toLowerCase().includes(leftSearch.toLowerCase())
      ),
    [left, leftSearch]
  );

  const filteredRight = useMemo(
    () =>
      right.filter((item) =>
        item.toLowerCase().includes(rightSearch.toLowerCase())
      ),
    [right, rightSearch]
  );

  useEffect(() => {
    setLeft(properties);
    setRight(selectedProperties);
  }, [properties]);

  useEffect(() => {
    // Call the callback function whenever the `right` variable is updated
    onSelectedPropertiesChange(right);
  }, [right, onSelectedPropertiesChange]);

  const handleToggle = (value) => () => {
    if (isCheckboxDisabled("right", value)) {
      return;
    }
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items, option) => () => {
    const nonDisabledItems = items.filter(
      (item) => !isCheckboxDisabled(option, item)
    );
    const nonDisabledChecked = intersection(checked, nonDisabledItems);

    if (nonDisabledChecked.length === nonDisabledItems.length) {
      setChecked(not(checked, nonDisabledItems));
    } else {
      setChecked(union(checked, nonDisabledItems));
    }
  };

  const originalOrder = useMemo(() => properties, [properties]);

  const sortBasedOnOriginalOrder = (items) => {
    return items.sort(
      (a, b) => originalOrder.indexOf(a) - originalOrder.indexOf(b)
    );
  };

  const handleCheckedRight = () => {
    const newRight = sortBasedOnOriginalOrder(right.concat(leftChecked));
    const newLeft = sortBasedOnOriginalOrder(not(left, leftChecked));

    setRight(newRight);
    setLeft(newLeft);
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    const newLeft = sortBasedOnOriginalOrder(left.concat(rightChecked));
    const newRight = sortBasedOnOriginalOrder(not(right, rightChecked));

    setLeft(newLeft);
    setRight(newRight);
    setChecked(not(checked, rightChecked));
  };

  // Utility function to check if the checkbox should be disabled
  const isCheckboxDisabled = (option, value) => {
    const disabledValues = [
      "GeneID",
      "uniprot_id",
      "InterPro ID",
      "Uniprot_id",
      "CitationID",
      "uniprot_accession",
    ];
    return option === "right" && disabledValues.includes(value);
  };

  const customList = (title, items, option = "left") => (
    <Card
      elevation={4}
      sx={{ mb: 2 }}
    >
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items, option)}
            checked={
              numberOfChecked(items) === items.length && items.length !== 0
            }
            indeterminate={
              numberOfChecked(items) !== items.length &&
              numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected",
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: "100%",
          height: 300,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value}-label`;

          if (isCheckboxDisabled(option, value)) {
            return (
              <ListItem
                key={value}
                role="listitem"
                button
                onClick={handleToggle(value)}
              >
                <ListItemIcon>
                  <Checkbox
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": labelId,
                    }}
                    disabled
                    checked
                  />
                </ListItemIcon>
                <ListItemText
                  id={labelId}
                  primary={value}
                  primaryTypographyProps={{ fontSize: "1rem" }}
                />
              </ListItem>
            );
          }
          return (
            <ListItem
              key={value}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={value}
                primaryTypographyProps={{ fontSize: "1rem" }}
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Grid
          item
          xs={5.5}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato", textAlign: "center" }}
          >
            Available
          </Typography>
        </Grid>
        <Grid
          item
          xs={1}
        ></Grid>
        <Grid
          item
          xs={5.5}
        >
          <Typography
            variant="h6"
            sx={{ fontFamily: "Lato", textAlign: "center" }}
          >
            Selected
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Grid
          item
          xs={5.5}
        >
          <Autocomplete
            options={left}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search..."
              />
            )}
            onInputChange={(event, newInputValue) => {
              setLeftSearch(newInputValue);
            }}
            freeSolo
            size="small"
            open={false}
          />
        </Grid>
        <Grid
          item
          xs={1}
        ></Grid>
        <Grid
          item
          xs={5.5}
        >
          <Autocomplete
            options={right}
            getOptionLabel={(option) => option}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search..."
              />
            )}
            onInputChange={(event, newInputValue) => {
              setRightSearch(newInputValue);
            }}
            freeSolo
            size="small"
            open={false}
          />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        justifyContent="center"
        alignItems="center"
      >
        <Grid
          item
          xs={5.5}
        >
          {customList("Select All", filteredLeft)}
        </Grid>
        <Grid
          item
          xs={1}
        >
          <Grid
            container
            direction="column"
            alignItems="center"
          >
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedRight}
              disabled={leftChecked.length === 0}
              aria-label="move selected right"
            >
              &gt;
            </Button>
            <Button
              sx={{ my: 0.5 }}
              variant="outlined"
              size="small"
              onClick={handleCheckedLeft}
              disabled={rightChecked.length === 0}
              aria-label="move selected left"
            >
              &lt;
            </Button>
          </Grid>
        </Grid>
        <Grid
          item
          xs={5.5}
        >
          {customList("Select All", filteredRight, "right")}
        </Grid>
      </Grid>
    </>
  );
}
