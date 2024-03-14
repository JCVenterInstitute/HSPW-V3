const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * Utility functions to mediate presigned GET to S3 bucket.
 */

/**
 * Generates a presigned url and downloads a file from S3.
 * @param {object} options
 * @param {string} options.bucketName
 * @param {string} options.s3Key
 * @param {any} options.data The metadata for geneflow to process
 * @returns {Promise}
 */
exports.s3Download = async ({ bucketName, s3Key }) => {
  try {
    const fileName = s3Key.split("/").pop();
    return await getPresignUrl({ bucketName, s3Key, fileName });
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const getPresignUrl = async ({ bucketName, s3Key, fileName }) => {
  const params = {
    Bucket: bucketName,
    Key: s3Key,
    ResponseContentDisposition: `attachment; filename=${fileName}`,
  };
  const s3Client = new S3Client({ region: "us-east-2" });
  const command = new GetObjectCommand(params);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
