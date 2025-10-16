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

// Helper function to fetch permissions
exports.getPermissions = async (
  folderName,
  userName,
  mode = "read",
  raw = false
) => {
  console.log(
    `> Get Permissions: folder="${folderName}", user="${userName}", mode="${mode}", raw=${raw}`
  );

  // Initializes parmeters for get request
  const params = {
    Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
    Key: `${folderName}/.permissions`,
  };

  console.log("> Params: %o", params);

  const command = new GetObjectCommand(params);

  try {
    const response = await client.send(command);

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
      });

    const content = await streamToString(response.Body);
    const permissions = JSON.parse(content);

    // Returns full permissions data if raw = true
    if (raw) {
      return permissions;
    }

    // Bypass for when a new user is created
    if (folderName === "" && mode === "write") {
      return true;
    }

    // Bypass for when the user is the owner of the folder, else check permissions normally
    if (permissions?.["_meta"]?.["owner"] == userName) {
      return true;
    } else {
      return permissions?.[userName]?.[mode] === true;
    }
  } catch (error) {
    console.error("> Error fetching permissions from S3:", error);
    throw error;
  }
};

// Helper function to update permissions or create a new one
exports.updatePermissions = async (folderName, newPermissions) => {
  const params = {
    Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
    Key: `${folderName}.permissions`,
    Body: JSON.stringify(newPermissions),
  };

  const command = new PutObjectCommand(params);

  try {
    await client.send(command);
    console.log(
      `Updated permissions for folder "${folderName}":`,
      newPermissions
    );
  } catch (error) {
    console.error("Error updating permissions:", error);
    throw error;
  }
};

// Helper function to fetch list of files and folders within a folder
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

// Helper function to fetch Shortcuts from .shortcuts as a JSON
exports.getShortcuts = async (folderName) => {
  const key = `${folderName}/.shortcuts`;
  console.log("> Get Shortcuts: ", key);

  const params = {
    Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
    Key: key,
  };

  const command = new GetObjectCommand(params);

  try {
    const response = await client.send(command);

    const streamToString = (stream) =>
      new Promise((resolve, reject) => {
        const chunks = [];
        stream.on("data", (chunk) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf-8"))
        );
      });

    const content = await streamToString(response.Body);

    console.log("> .shortcuts content:", content);

    return JSON.parse(content);
  } catch (error) {
    if (error.name === "NoSuchKey" || error.Code === "NoSuchKey") {
      console.error(`> .shortcuts file does not exist at: ${key}`);
      return undefined; // Return empty object if file doesn't exist
    }

    console.error("Error reading .shortcuts file:", error);
    return undefined; // Also fallback to empty object on other read errors
  }
};

// Helper function to upload a single file to s3
exports.uploadS3Object = async (file, prefix = "", fileName, onProgress) => {
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
};

// Helper function to create a folder by uploading a .permissions file to the new folder path
exports.uploadS3Folder = async (
  userName = "ExampleUser",
  prefix = "",
  folderName
) => {
  const key = `${prefix}${folderName}/.permissions`;

  // Creates the initial data within .permissions in the following format:
  // {_meta = {owner: <owner>}, <user>: {read: <bool>, write: <bool>},...}
  const defaultPermissions = {};
  defaultPermissions["_meta"] = { owner: userName };

  const params = {
    Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
    Key: key,
    Body: JSON.stringify(defaultPermissions),
  };

  const command = new PutObjectCommand(params);

  try {
    await client.send(command);
    return { message: `Upload successful: ${key}`, key };
  } catch (error) {
    console.error("Error uploading file to S3: ", error);
    throw error;
  }
};

// Helper function to delete a single file from s3
exports.deleteS3File = async (fileKey) => {
  const params = {
    Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
    Delete: {
      Objects: [{ Key: fileKey }],
    },
  };

  const command = new DeleteObjectsCommand(params);
  try {
    await client.send(command);
  } catch (error) {
    console.error("Error deleting object from S3: ", error);
    throw error;
  }
};

// Helper function to delete a folder from s3
exports.deleteS3Folder = async (folderKey) => {
  const listParams = {
    Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
    Prefix: folderKey,
  };

  try {
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

//Helper function to generate a signed download URL for a file
exports.downloadS3Object = async (objectKey) => {
  const fileName = objectKey.split("/").pop() || "download";

  const params = {
    Bucket: process.env.DIFFERENTIAL_S3_BUCKET,
    Key: objectKey,
    ResponseContentDisposition: `attachment; filename="${fileName}"`,
  };

  const command = new GetObjectCommand(params);

  try {
    // Creates URL with 60 second validity
    const url = await getSignedUrl(client, command, { expiresIn: 60 });
    return url;
  } catch (error) {
    console.error("Error getting object url from S3: ", error);
    throw error;
  }
};
