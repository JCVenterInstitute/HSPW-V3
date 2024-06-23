import axios from "axios";

/**
 * Parses the csv string
 * @param {string} csvText CSV String
 * @param {string} selectedSection Current section selected by user
 * @returns
 */
export const parseCSV = (csvText, selectedSection) => {
  const lines = csvText.split("\n");

  // Detect delimiter (comma or tab)
  const delimiter = lines[0].indexOf("\t") >= 0 ? "\t" : ",";

  // Split the first line with the detected delimiter to get headers
  let headers = lines[0].split(delimiter);

  // Replace the first header if it's empty and remove quotes from all headers
  headers = headers.map((header, index) => {
    if (
      index === 0 &&
      (header.replace(/['"]+/g, "") === "" ||
        header.replace(/['"]+/g, "") === "rn")
    ) {
      return selectedSection === "Principal Component Analysis"
        ? "Sample"
        : "Protein";
    } else {
      return header.replace(/['"]+/g, "");
    }
  });

  const parsedData = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(delimiter);

    if (currentLine.length === headers.length) {
      const row = {};
      for (let j = 0; j < headers.length; j++) {
        row[headers[j].trim()] = currentLine[j].trim();
      }
      parsedData.push(row);
    }
  }

  return parsedData;
};

/**
 * Fet the relevant style needed for the image depending on selected section
 * @param {string} selectedItem Current section selected by user
 */
export const getImageStyle = (selectedItem) => {
  if (selectedItem === "Venn-Diagram") {
    return {
      maxWidth: "600px",
      maxHeight: "600px",
      width: "100%",
      height: "auto",
    };
  }

  return { maxWidth: "100%", maxHeight: "100%", height: "auto" };
};

/**
 * Returns the csv data & the download link for the file
 * @param {*} jobId Id of analysis submission job, used to help locate s3 file
 * @param {*} fileName Name of the s3 file
 */
export const fetchCSV = async (jobId, fileName) => {
  try {
    let response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
    );

    const csvText = await axios.get(response.data.url).then((res) => res.data);

    return {
      data: parseCSV(csvText),
      downloadUrl: response.data.url,
      textUrl: URL.createObjectURL(new Blob([csvText], { type: "text/csv" })),
    };
  } catch (error) {
    console.error("Error fetching csv:", error);
  }
};

export const fetchData = async (url) => {
  try {
    let csv = await axios.get(url).then((res) => res.data);

    return {
      data: parseCSV(csv),
    };
  } catch (error) {
    console.error("Error fetching csv:", error);
  }
};

/**
 * Download the specified file from the submission
 * @param {string} jobId Id of analysis submission job
 * @param {string} fileName Name of file from the submission to download
 */
export const handleDownload = async (jobId, fileName) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
    );
    const link = document.createElement("a");
    link.href = res.data.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading file:", error);
  }
};

/**
 * Get s3 link for a file from the submission
 * @param {string} jobId Id of analysis submission job
 * @param {string} fileName Name of file to get file url
 * @returns
 */
export const getFileUrl = async (jobId, fileName) => {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_ENDPOINT}/api/s3Download/${jobId}/${fileName}`
    );
    return response.data.url;
  } catch (error) {
    console.error("Error getting file url:", error);
  }
};
