const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

/**
 * Utility functions to mediate presigned PUT to S3 bucket.
 */

/**
 * Uploads data to S3 directly (no presigned URL).
 * @param {object} options
 * @param {string} options.bucketName
 * @param {string} options.s3Key
 * @param {Buffer|string} options.data  // JSON as Buffer or string
 * @param {string} options.contentType  // e.g., 'application/json'
 * @returns {Promise} S3 upload result
 */
exports.s3Upload = async ({ bucketName, s3Key, data, contentType }) => {
  const params = {
    Bucket: bucketName,
    Key: s3Key,
    Body: data,
    ContentType: contentType,
  };
  const s3Client = new S3Client({ region: "us-east-2" });
  try {
    const result = await s3Client.send(new PutObjectCommand(params));
    console.log(`✔️ Successfully uploaded to S3: ${s3Key}`);
    return result;
  } catch (error) {
    console.error(`❌ Error uploading to S3: ${error.message}`);
    throw error;
  }
};
