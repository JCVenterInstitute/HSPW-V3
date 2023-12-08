import "../filter.css";

import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "../table.css";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";
import { DATA } from "../data";
import { ICellRendererParams } from "ag-grid-community";
import "../table.css";
import first_pic from "../../download_icon/first_pic.png";
import second_pic from "../../download_icon/second_pic.png";
import third_pic from "../../download_icon/third_pic.png";
import first_pic_hover from "../../download_icon/first_pic_hover.png";
import second_pic_hover from "../../download_icon/second_pic_hover.png";
import third_pic_hover from "../../download_icon/third_pic_hover.png";
import MzTab from "../../download_icon/MzTab.png";
import METADATA from "../../download_icon/METADATA.png";
import RAW from "../../download_icon/RAW.png";

function LinkComponent(props) {
  const imageUrlArray = [first_pic, second_pic, third_pic];
  const hoverImageUrlArray = [
    third_pic_hover,
    second_pic_hover,
    third_pic_hover,
  ];
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
      {imageUrlArray.map((imageUrl, index) => (
        <a
          key={index}
          target="_blank"
          rel="noopener noreferrer"
          href={props.value}
          className={index === currentIndex && isHovered ? "download-link" : ""}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          <img
            src={
              index === currentIndex
                ? isHovered
                  ? hoverImageUrlArray[index]
                  : imageUrl
                : imageUrl
            }
            style={{ marginLeft: "5px", marginRight: "5px" }}
            alt={`Link ${index + 1}`}
          />
          {index === currentIndex && isHovered && (
            <>
              <div className="download-hover-content">
                <img
                  src={downloadIcons[index]}
                  alt={`${downloadIcons[index]} Image`}
                  className="download-hover-image"
                />
              </div>
            </>
          )}
        </a>
      ))}
    </>
  );
}

function DownloadTable() {
  const [gridApi, setGridApi] = useState();
  const rowData = DATA;

  const rowHeight = 120;

  const columns = [
    {
      headerName: "Study #",
      field: "study",
      checkboxSelection: false,
      headerCheckboxSelection: false,
      maxWidth: 141.5,
      maxHeight: 10,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Study Name",
      field: "project",
      autoHeight: true,
      wrapText: true,
      cellStyle: { wordBreak: "break-word" },
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Disease",
      field: "disease",
      maxWidth: 175.8,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Institution",
      field: "institution",
      maxWidth: 290,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Year",
      field: "year",
      maxWidth: 115,
      autoHeight: true,
      wrapText: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
    {
      headerName: "Download",
      field: "download",
      cellRenderer: "LinkComponent",
      maxWidth: 205,
      autoHeight: true,
      headerClass: ["header-border"],
      cellClass: ["table-border"],
    },
  ];

  const defColumnDefs = {
    flex: 1,
    filter: true,
    editable: true,
    sortable: true,
  };

  const onGridReady = (params) => {
    setGridApi(params);
  };

  return (
    <>
      <div className="AppBox" style={{ width: "76%" }}>
        <div
          className="ag-theme-material ag-cell-wrap-text ag-theme-alpine"
          style={{ height: 600 }}
        >
          <AgGridReact
            rowData={rowData}
            frameworkComponents={{
              LinkComponent,
            }}
            rowHeight={rowHeight}
            className="ag-cell-wrap-text"
            columnDefs={columns}
            defaultColDef={defColumnDefs}
            onGridReady={onGridReady}
          />
        </div>
      </div>
    </>
  );
}

export default DownloadTable;
