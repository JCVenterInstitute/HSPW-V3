import React, { useEffect, useState } from "react";
import Papa from "papaparse"; // CSV parsing library
import NetworkGraph from "./NetworkGraph"; // Import NetworkGraph component
import csvDataFile from "./string_unq2.csv";

const NetworkGraphContainer = () => {
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    // Parse the CSV file on load
    const parseCsv = () => {
      Papa.parse(csvDataFile, {
        download: true, // Specify to download the file if it's an external link
        header: true, // Parse with headers
        complete: (result) => {
          setCsvData(result.data); // Set parsed data
        },
        error: (error) => {
          console.error("Error parsing CSV: ", error);
        },
      });
    };

    parseCsv(); // Parse CSV on component mount
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      {" "}
      {/* Fullscreen */}
      {/* {csvData.length > 0 && <NetworkGraph csvData={csvData} />} */}
    </div>
  );
};

export default NetworkGraphContainer;
