import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import LocalLibraryOutlinedIcon from "@material-ui/icons/LocalLibraryOutlined";
import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";
import DescriptionOutlinedIcon from "@material-ui/icons/DescriptionOutlined";
import React from "react";

export const menu = [
  {
    title: "Normalization",
    items: [
        {
            title:"Z-Score",
            items:[]
        },
        {
            title:"Rank",
            items:[]
        },
        {
            title:"Quantile",
            item:[]
        },
        {
            title:"Median",
            items:[]
        }
    ]
  },
  {
    title: "Filtering",
    items: [
      {
        title: "Interquantile Range",
        items: [
        ]
      },
      {
        title: "Standard deviation",
        items: [
        ]
      },
      {
        title: "Median absolute deviation",
        items: [
        ]
      },
      {
        title: "Non-parametric relative standard deviation",
        items: [
        ]
      },
      {
        title: "Mean intensity value",
        items: [
        ]
      },
      {
        title: "Median intensity value",
        items: [
        ]
      },
    ]
  },
  {
    title: "Export",
    items:[
        {
            title:"Heatmap",
            items:[]
        },
        {
            title:"Volcano Plot",
            items:[]
        },
        {
            title:"Histogram",
            item:[]
        }
    ]
  }
];