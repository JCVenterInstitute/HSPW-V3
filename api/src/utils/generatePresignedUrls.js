const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

exports.generatePresignedUrls = async (
  bucketName,
  fileNames,
  topic,
  timestamp
) => {
  try {
    const urls = await Promise.all(
      fileNames.map((fileName) =>
        getPresignUrl({ bucketName, fileName, topic, timestamp })
      )
    );
    return urls;
  } catch (error) {
    console.error("Error in generatePresignedUrls: ", error);
    throw error; // Rethrow the error for handling it in the caller
  }
};

const getPresignUrl = async ({ bucketName, fileName, topic, timestamp }) => {
  // Construct the s3Key using topic, timestamp and fileName
  const s3Key = `${topic}/${timestamp.year}-${timestamp.month}-${timestamp.day}/${timestamp.hours}${timestamp.minutes}${timestamp.seconds}/${fileName}`;

  // Assuming a default contentType if not provided
  const contentType = "application/octet-stream";

  const params = {
    Bucket: bucketName,
    Key: s3Key,
    ContentType: contentType,
  };

  const s3Client = new S3Client({ region: "us-east-2" });
  const command = new PutObjectCommand(params);
  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};
