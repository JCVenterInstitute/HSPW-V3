const fs = require("fs");
const Papa = require("papaparse");

// Read the JSON file
const jsonData = fs.readFileSync("study.json", "utf8");

// Parse the JSON data
const parsedData = JSON.parse(jsonData);

// Convert JSON to CSV
const csv = Papa.unparse(parsedData);

// Write CSV to file
fs.writeFileSync("study.csv", csv);

console.log("Conversion complete. CSV file generated.");
