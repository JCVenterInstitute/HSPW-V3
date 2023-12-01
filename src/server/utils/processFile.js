const fs = require("fs");
const path = require("path");

exports.processFile = async (inputData, workingDirectory) => {
  console.log("> Processing File Data");

  // Convert csv to tsv
  const tsv = input.replace(",", "\t");
  // Save to file
  const filePath = path.join(workingDirectory, "inputdata.txt");
  fs.writeFileSync(filePath, tsv);
  console.log(`Data saved to ${filePath}`);
};
