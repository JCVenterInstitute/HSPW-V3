const {
  S3Client,
  ListObjectsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const dotenv = require("dotenv");

dotenv.config();

const client = new S3Client({
  region: "us-east-2",
});

/**
 * Convert a ReadableStream to a string
 * @param {ReadableStream} stream The ReadableStream to convert
 * @returns {Promise<string>} A promise that resolves to the string content of the stream
 */
const streamToString = (stream) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf-8")));
  });

/**
 * Fetch permissions for a given folder and user
 * @param {string} folderName Name of the folder to fetch permissions for
 * @param {string} userName Name of the user to check permissions for
 * @param {string} mode Mode of permission to check, either "read" or "write" (default: "read")
 * @param {boolean} raw Whether to return the full permissions JSON (default: false)
 */
exports.getPermissions = async (
  folderName,
  userName,
  mode = "read",
  raw = false
) => {
  console.log(
    `> Fetching Permissions for user ${userName} on folder ${folderName} in ${mode} mode...`
  );

  try {
    const params = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Key: `${folderName}/.permissions`,
    };

    const command = new GetObjectCommand(params);

    const response = await client.send(command);

    const content = await streamToString(response.Body);

    const permissions = JSON.parse(content);

    // Returns full permissions data if raw = true
    if (raw) {
      return permissions;
    }

    const isNewUser = folderName === "" && mode === "write";
    const userIsFolderOwner = permissions?.["_meta"]?.["owner"] == userName;

    // Bypass for when a new user is created or if user is folder owner
    if (isNewUser || userIsFolderOwner) {
      return true;
    }

    return permissions?.[userName]?.[mode] === true;
  } catch (error) {
    console.error("> Error fetching permissions from S3:", error);
    throw error;
  }
};

/**
 * Update permissions for a given folder
 * @param {string} folderName Name of the folder to update permissions for
 * @param {object} newPermissions New permissions JSON to upload
 */
exports.updatePermissions = async (folderName, newPermissions) => {
  try {
    console.log(
      `> Updating Permissions for folder ${folderName} with new permissions: %o`,
      newPermissions
    );

    const params = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Key: `${folderName}.permissions`,
      Body: JSON.stringify(newPermissions),
    };

    const command = new PutObjectCommand(params);

    await client.send(command);

    console.log(`> Permissions updated`);
  } catch (error) {
    console.error("Error updating permissions:", error);
    throw error;
  }
};

/**
 * List files and folders within a specified S3 prefix
 * @param {string} prefix The S3 prefix (folder path) to list objects from
 * @returns {object} An object containing arrays of files and folders
 */
exports.listS3Objects = async (prefix = "") => {
  try {
    const input = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Prefix: prefix,
      Delimiter: "/",
    };

    const command = new ListObjectsCommand(input);
    const response = await client.send(command);

    const contents = response.Contents || [];
    const prefixes = response.CommonPrefixes || [];

    // Returns combined files and folders as a JSON
    return {
      files: contents.filter((file) => {
        const fileName = file.Key.split("/").pop();

        // don't return metadata files
        return fileName && !fileName.startsWith(".");
      }),
      folders: prefixes,
    };
  } catch (error) {
    console.error("Error listing S3 objects: ", error);
    throw error;
  }
};

/**
 * Fetch shortcuts from a specified folder's .shortcuts file
 * @param {string} folderName Name of the folder to fetch shortcuts from
 * @returns {object|undefined} The shortcuts JSON or undefined if the file doesn't exist
 */
exports.getShortcuts = async (folderName) => {
  try {
    const key = `${folderName}/.shortcuts`;

    console.log("> Get Shortcuts: ", key);

    const params = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Key: key,
    };

    const command = new GetObjectCommand(params);

    const response = await client.send(command);

    const content = await streamToString(response.Body);

    return JSON.parse(content);
  } catch (error) {
    if (error.name === "NoSuchKey" || error.Code === "NoSuchKey") {
      console.error(`> Shortcuts file does not exist at: ${key}`);
      return undefined; // Return empty object if file doesn't exist
    }

    console.error("Error reading .shortcuts file:", error);
    return undefined; // Also fallback to empty object on other read errors
  }
};

/**
 * Upload a file to S3 with support for large files and progress tracking
 * @param {Buffer|ReadableStream} file The file to upload (Buffer or ReadableStream)
 * @param {string} prefix The S3 prefix (folder path) to upload the file to
 * @param {string} fileName The name of the file to be saved as in S3
 * @param {function} onProgress Optional callback function to track upload progress
 * @returns {object} An object containing a success message and the S3 key of the uploaded file
 */
exports.uploadS3Object = async (file, prefix = "", fileName, onProgress) => {
  try {
    const key = `${prefix}${fileName}`;

    // Splits file into 20mb chunks for concurrent upload
    const upload = new Upload({
      client,
      params: {
        Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
        Key: key,
        Body: file?.buffer || file,
        ContentType: file?.mimetype || "application/octet-stream",
      },
      queueSize: 4, // concurrency (4 parts at a time)
      partSize: 20 * 1024 * 1024, // 20 MB per part
    });

    // attempt at making a loading bar
    upload.on("httpUploadProgress", (progress) => {
      if (onProgress) onProgress(progress);
    });

    await upload.done();

    return { message: `Upload successful: ${key}`, key };
  } catch (error) {
    console.error("Error uploading file to S3: ", error);
  }
};

/**
 * Create a new folder in S3 by uploading a .permissions file with default permissions
 * @param {string} userName Name of the user creating the folder (set as owner)
 * @param {string} prefix The S3 prefix (parent folder path) to create the new folder in
 * @param {string} folderName The name of the new folder to create
 * @returns {object} An object containing a success message and the S3 key of the created folder
 */
exports.uploadS3Folder = async (
  userName = "ExampleUser",
  prefix = "",
  folderName
) => {
  try {
    const key = `${prefix}${folderName}/.permissions`;

    // Creates the initial data within .permissions in the following format:
    // {_meta = {owner: <owner>}, <user>: {read: <bool>, write: <bool>},...}
    const defaultPermissions = {
      _meta: { owner: userName },
    };

    const params = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Key: key,
      Body: JSON.stringify(defaultPermissions),
    };

    const command = new PutObjectCommand(params);

    await client.send(command);

    return { message: `Upload successful: ${key}`, key };
  } catch (error) {
    console.error("Error uploading file to S3: ", error);
    throw error;
  }
};

/**
 * Delete a single file from S3
 * @param {string} fileKey The S3 key of the file to delete
 */
exports.deleteS3File = async (fileKey) => {
  try {
    const params = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Delete: {
        Objects: [{ Key: fileKey }],
      },
    };

    const command = new DeleteObjectsCommand(params);

    await client.send(command);
  } catch (error) {
    console.error("Error deleting object from S3: ", error);
    throw error;
  }
};

/**
 * Delete a folder and all its contents from S3
 * @param {string} folderKey The S3 key prefix of the folder to delete (should end with '/')
 */
exports.deleteS3Folder = async (folderKey) => {
  try {
    const listParams = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Prefix: folderKey,
    };

    const listedObjects = await client.send(
      new ListObjectsV2Command(listParams)
    );

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
      console.log("No contents found under prefix:", folderKey);
      throw new Error("Folder is empty or does not exist.");
    }

    // Creates a JSON containing all keys of all objects below the folder for batch deletion
    const objectsToDelete = listedObjects.Contents.map((obj) => ({
      Key: obj.Key,
    }));

    const deleteParams = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Delete: {
        Objects: objectsToDelete,
        Quiet: false,
      },
    };

    const deleteResult = await client.send(
      new DeleteObjectsCommand(deleteParams)
    );

    console.log("Deleted objects:", deleteResult.Deleted);

    return deleteResult;
  } catch (error) {
    console.error("Error deleting folder from S3:", error);
    throw error;
  }
};

/**
 * Generate a pre-signed URL for downloading an object from S3
 * @param {string} objectKey The S3 key of the object to generate a download URL for
 * @returns {string} A pre-signed URL valid for 60 seconds
 */
exports.downloadS3Object = async (objectKey) => {
  try {
    const fileName = objectKey.split("/").pop() || "download";

    const params = {
      Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
      Key: objectKey,
      ResponseContentDisposition: `attachment; filename="${fileName}"`,
    };

    const command = new GetObjectCommand(params);

    // Creates URL with 60 second validity
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return url;
  } catch (error) {
    console.error("Error getting object url from S3: ", error);
    throw error;
  }
};
