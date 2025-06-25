const {
  S3Client,
  GetObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

/**
 * Utility functions to mediate presigned GET to S3 bucket.
 */

/**
 * Generates a presigned url and downloads a file from S3.
 * @param {string} options.bucketName
 * @param {string} options.s3Key
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

/**
 * Check if the file with s3 key exist in the given bucket
 * @param {string} bucketName S3 bucket you're checking in
 * @param {string} s3Key S3 Key of file you're checking for
 * @returns True if file exists, false otherwise
 */
exports.checkFileExists = async (bucketName, s3Key) => {
  const s3Client = new S3Client({ region: "us-east-2" });

  const params = {
    Bucket: bucketName,
    Key: s3Key,
  };

  try {
    await s3Client.send(new HeadObjectCommand(params));
    console.log(`File exists: ${s3Key}`);
    return true;
  } catch (error) {
    if (error.name === "NotFound") {
      console.log(`File does not exist: ${s3Key}`);
      return false;
    } else {
      console.error(`Error checking file: ${error.message}`);
      throw error;
    }
  }
};
