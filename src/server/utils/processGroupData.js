const axios = require("axios");
const { getPresignUrl } = require("./s3Upload");

const fetchProteinData = async (experimentIdKey) => {
  try {
    const response = await axios(
      `${process.env.API_ENDPOINT}/api/study-protein/${experimentIdKey}`
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

    // Create a mapping from Uniprot_id to protein_name
    const proteinNamesMap = {};

    proteinData.forEach((protein) => {
      proteinIds.add(protein.Uniprot_id);
      proteinNamesMap[protein.Uniprot_id] = protein.protein_name;
    }); // Collect protein IDs & names

    // First, collect abundances with Uniprot_id as key
    const proteinAbundances = proteinData.reduce((acc, protein) => {
      acc[`${protein.Uniprot_id}`] = protein.abundance;
      return acc;
    }, {});

    // After reducer, update keys to "Uniprot_id - protein_name"
    const proteinAbundancesWithNames = {};
    Object.entries(proteinAbundances).forEach(([uniprotId, abundance]) => {
      const name = proteinNamesMap[uniprotId] || "";
      proteinAbundancesWithNames[`${uniprotId} - ${name}`] = abundance;
    });

    processedSamples.push({
      Identifier: sample.experiment_short_title, // Replace 'sample_name' with the correct property name
      Group: groupLabel,
      ...proteinAbundancesWithNames,
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
      sample.Identifier.replaceAll("#", ""), // remove # from identifiers, causes issue with rScript
      sample.Group,
      ...proteinIds.map((id) => sample[id] || "0"),
    ].join("\t");
  });

  return [header, ...rows].join("\n");
};

exports.processGroupData = async (
  { groupAData, groupBData },
  timestamp,
  formattedDate,
  groupNames
) => {
  console.log("> Processing Group Data");

  const { processedSamples: processedGroupA } = await processSamples(
    groupAData,
    groupNames && groupNames.groupA ? groupNames.groupA : "A"
  );

  const { processedSamples: processedGroupB } = await processSamples(
    groupBData,
    groupNames && groupNames.groupB ? groupNames.groupB : "B"
  );

  const combinedData = [...processedGroupA, ...processedGroupB];

  // Create CSV string
  const csvString = createCsvString(combinedData);

  const contentType = "text/csv";

  const { year, month, day } = timestamp;

  const s3FileLocation = `jobs/${year}-${month}-${day}/differential-expression-${formattedDate}`;

  const presignedUrl = await getPresignUrl({
    bucketName: process.env.DIFFERENTIAL_S3_BUCKET,
    s3Key: s3FileLocation,
    contentType,
  });

  await axios.put(presignedUrl, csvString, {
    headers: {
      "Content-Type": contentType,
    },
  });

  return s3FileLocation;
};
