import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import LocalLibraryOutlinedIcon from "@material-ui/icons/LocalLibraryOutlined";
import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import React from "react";

export const menu = [
  {
    title: "Uniprot Accession",
    items: [],
  },
  {
    title: "Gene Symbol",
  },
  {
    title: "Protein Name",
  },
  {
    title: "MS",
    items: [
      {
        title: "WS",
        items: [{ title: "High" }, { title: "Medium" }, { title: "Low" }],
      },
      {
        title: "Par",
        items: [{ title: "High" }, { title: "Medium" }, { title: "Low" }],
      },
      {
        title: "Sub",
        item: [{ title: "High" }, { title: "Medium" }, { title: "Low" }],
      },
      {
        title: "B",
        items: [{ title: "High" }, { title: "Medium" }, { title: "Low" }],
      },
    ],
  },
  {
    title: "IHC",
    items: [{ title: "High" }, { title: "Medium" }, { title: "Low" }],
  },
];

export const menu1 = [];
