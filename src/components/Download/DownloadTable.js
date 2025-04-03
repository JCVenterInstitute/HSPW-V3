import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { Container } from "@mui/material";

import { DATA } from "../../data/downloadTableData.js";
import MetaDataIcon from "@Assets/download-table-icons/MetaDataIcon.png";
import MzTabIcon from "@Assets/download-table-icons/MzTabIcon.png";
import RawIcon from "@Assets/download-table-icons/RawIcon.png";
import RawIconHover from "@Assets/download-table-icons/RawIconHover.png";
import MzTabIconHover from "@Assets/download-table-icons/MzTabIconHover.png";
import MetaDataIconHover from "@Assets/download-table-icons/MetaDataIconHover.png";
import MzTab from "@Assets/download-table-icons/MzTab.png";
import METADATA from "@Assets/download-table-icons/METADATA.png";
import RAW from "@Assets/download-table-icons/RAW.png";
import "../Filter.css";
import "../Table.css";

function LinkComponent(props) {
  const { value, data } = props;

  const paperUrl = data?.paper;

  return (
    <div>
      {paperUrl ? (
        <a
          href={paperUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {value}
        </a>
      ) : (
        value
      )}
    </div>
  );
}

function DownloadComponent(props) {
  const imageUrlArray = [MetaDataIcon, MzTabIcon, RawIcon];

  const hoverImageUrlArray = [MetaDataIconHover, MzTabIconHover, RawIconHover];

  const downloadIcons = [METADATA, MzTab, RAW];
  const [isHovered, setIsHovered] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleMouseEnter = (index) => {
    setIsHovered(true);
    setCurrentIndex(index);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setCurrentIndex(-1);
  };

  return (
    <>
      {imageUrlArray.map((imageUrl, index) => {
        return props.value[index] ? (
          <a
            key={index}
            rel="noopener noreferrer"
            href={props.value[index]} // Each image has a unique URL
            target="_blank"
            className={
              index === currentIndex && isHovered ? "download-link" : ""
            }
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={
                index === currentIndex && isHovered
                  ? hoverImageUrlArray[index]
                  : imageUrl
              }
              style={{
                marginRight: "5px",
                marginTop: "5px",
                width: "30px",
                height: "30px",
              }}
              alt={`Link ${index + 1}`}
            />
            {index === currentIndex && isHovered && (
              <div className="download-hover-content">
                <img
                  style={{ margin: "0px 16px -12px 0px" }}
                  src={downloadIcons[index]}
                  alt={`${downloadIcons[index]}`}
                  className="download-hover-image"
                />
              </div>
            )}
          </a>
        ) : (
          <img
            key={index}
            src={imageUrl}
            style={{
              marginRight: "5px",
              marginTop: "5px",
              width: "30px",
              height: "30px",
              opacity: "30%",
            }}
            alt={`Link ${index + 1}`}
          />
        );
      })}
    </>
  );
}

function DownloadTable() {
  const rowData = DATA;

  const rowHeight = 70;

  const columns = [
    {
      headerName: "Study #",
      field: "study",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      maxWidth: 141.5,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "download-cell"],
    },
    {
      headerName: "Study Name",
      field: "project",
      cellRenderer: "LinkComponent",
      autoHeight: true,
      wrapText: true,
      cellStyle: { wordBreak: "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border", "download-cell"],
    },
    {
      headerName: "Disease",
      field: "disease",
      maxWidth: 175.8,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "download-cell"],
    },
    {
      headerName: "Institution",
      field: "institution",
      maxWidth: 290,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "download-cell"],
    },
    {
      headerName: "Year",
      field: "year",
      maxWidth: 115,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "download-cell"],
    },
    {
      headerName: "Download",
      field: "download",
      cellRenderer: "DownloadComponent",
      maxWidth: 170,
      autoHeight: true,
      headerClass: ["header-border"],
      cellClass: ["table-border", "download-cell"],
    },
  ];

  const defColumnDefs = {
    flex: 1,
    filter: true,
    editable: true,
    sortable: true,
    resizable: true,
  };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ mt: 3 }}
      >
        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{ height: 600 }}
        >
          <AgGridReact
            rowData={rowData}
            components={{
              DownloadComponent,
              LinkComponent,
            }}
            rowHeight={rowHeight}
            className="ag-cell-wrap-text"
            columnDefs={columns}
            defaultColDef={defColumnDefs}
          />
        </div>
      </Container>
    </>
  );
}

export default DownloadTable;
