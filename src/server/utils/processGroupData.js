const axios = require("axios");
const fs = require("fs");
const path = require("path");

const fetchProteinData = async (experimentIdKey) => {
  try {
    const response = await axios(
      `http://localhost:8000/api/study_protein/${experimentIdKey}`
    );
    return response.data.map((item) => item._source);
  } catch (error) {
    console.error("Error fetching protein data:", error);
    return [];
  }
};

const processSamples = async (samples, groupLabel) => {
  const processedSamples = [];
  const proteinIds = new Set();

  for (const sample of samples) {
    const proteinData = await fetchProteinData(sample.experiment_id_key);
    proteinData.forEach((protein) => proteinIds.add(protein.Uniprot_id)); // Collect protein IDs

    const proteinAbundances = proteinData.reduce((acc, protein) => {
      acc[protein.Uniprot_id] = protein.abundance; // Replace 'abundance' with the correct property name
      return acc;
    }, {});

    processedSamples.push({
      Identifier: sample.experiment_short_title, // Replace 'sample_name' with the correct property name
      Group: groupLabel,
      ...proteinAbundances,
    });
  }

  return { processedSamples, proteinIds };
};

const createCsvString = (data) => {
  // Find all unique protein IDs
  const proteinIds = [
    ...new Set(
      data.flatMap((sample) =>
        Object.keys(sample).filter(
          (key) => key !== "Identifier" && key !== "Group"
        )
      )
    ),
  ].sort();

  // Create CSV header
  const header = ["Identifiers", "Group", ...proteinIds].join("\t");

  // Create each row
  const rows = data.map((sample) => {
    return [
      sample.Identifier,
      sample.Group,
      ...proteinIds.map((id) => sample[id] || "0"),
    ].join("\t");
  });

  return [header, ...rows].join("\n");
};

exports.processGroupData = async (
  { groupAData, groupBData },
  workingDirectory
) => {
  console.log("> Processing Group Data");

  const { processedSamples: processedGroupA, proteinIds: proteinIdsA } =
    await processSamples(groupAData, "HP");
  const { processedSamples: processedGroupB, proteinIds: proteinIdsB } =
    await processSamples(groupBData, "CP");

  const combinedData = [...processedGroupA, ...processedGroupB];

  // Create CSV string
  const csvString = createCsvString(combinedData);

  // Save to file
  const csvFilePath = path.join(workingDirectory, "inputData.txt");
  fs.writeFileSync(csvFilePath, csvString);
  console.log(`Data saved to ${csvFilePath}`);

  // Save protein lists
  const list1FilePath = path.join(workingDirectory, "list1");
  const list2FilePath = path.join(workingDirectory, "list2");

  fs.writeFileSync(list1FilePath, Array.from(proteinIdsA).sort().join("\n"));
  fs.writeFileSync(list2FilePath, Array.from(proteinIdsB).sort().join("\n"));

  console.log(`Protein list for Group A saved to ${list1FilePath}`);
  console.log(`Protein list for Group B saved to ${list2FilePath}`);
};
