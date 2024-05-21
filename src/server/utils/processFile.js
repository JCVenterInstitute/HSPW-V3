const { getPresignUrl } = require("./s3Upload");
const axios = require("axios");

exports.processFile = async (inputData, timestamp, formattedDate) => {
  console.log("> Processing File Data");

  // Convert csv to tsv
  const tsv = inputData.replaceAll(",", "\t");

  const { year, month, day } = timestamp;
  const contentType = "text/plain";
  const s3FileLocation = `jobs/${year}-${month}-${day}/differential-expression-${formattedDate}`;

  const presignedUrl = await getPresignUrl({
    bucketName: process.env.DIFFERENTIAL_S3_BUCKET,
    s3Key: s3FileLocation,
    contentType,
  });

  await axios.put(presignedUrl, tsv, {
    headers: {
      "Content-Type": contentType,
    },
  });

  return s3FileLocation;
};
