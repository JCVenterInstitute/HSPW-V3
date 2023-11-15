const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * Utility functions to mediate presigned PUT to S3 bucket.
 */

/**
 * Generates a presigned url and uploads a file to S3.
 * @param {object} options
 * @param {string} options.bucketName
 * @param {string} options.s3Key
 * @param {string} options.contentType File mime type.
 * @param {any} options.data The metadata for geneflow to process
 * @returns {Promise}
 */
exports.s3Upload = ({ directoryPath, bucketName, s3Key, contentType }) => {
  fs.readdir(directoryPath, async (err, files) => {
    if (err) {
      console.error("Could not list the directory.", err);
      process.exit(1);
    }

    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      const s3KeyPath = `/${s3Key}/${file}`; // Define how you want the S3 key to be named
      console.log(s3KeyPath);

      try {
        const presignedUrl = await getPresignUrl({
          bucketName,
          s3KeyPath,
          contentType,
        });

        const response = await axios.put(
          presignedUrl,
          fs.createReadStream(filePath),
          {
            headers: {
              "Content-Type": contentType,
              "Content-Length": fs.statSync(filePath).size,
            },
          }
        );

        console.log(`> Successfully uploaded file: ${file}`);
      } catch (error) {
        console.error("Error uploading file:", error.message);
      }
    }
  });
};

const getPresignUrl = async ({ bucketName, s3Key, contentType }) => {
  const params = {
    Bucket: bucketName,
    Key: s3Key,
    ContentType: contentType,
  };
  const s3Client = new S3Client({ region: "us-east-2" });
  const command = new PutObjectCommand(params);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
