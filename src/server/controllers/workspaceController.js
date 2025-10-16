const {
  listS3Objects,
  getShortcuts,
  uploadS3Object,
  uploadS3Folder,
  deleteS3File,
  deleteS3Folder,
  getPermissions,
  downloadS3Object,
  updatePermissions,
} = require("../utils/s3Utils.js");

const listFiles = async (req, res) => {
  try {
    const { prefix, user } = req.query;

    // Trim the given prefix of trailing '/'
    const trimmedPrefix = prefix.replace(/\/$/, "");

    // Checks if the user has read permissions for this folder
    const isAuthorized = prefix.startsWith(`users/${user}/`)
      ? true // user should have access to all of their own files
      : await getPermissions(trimmedPrefix, user, "read");

    if (!isAuthorized) {
      return res
        .status(403)
        .json({ error: "Access denied: Read permission required." });
    }

    // Stores all the prefixs under the given prefix in JSON format
    const data = await listS3Objects(prefix);

    let shortcuts = {};

    // If the user is currently navigated to the 'Shared Folders' folder
    // Use helper function to create a JSON of shortcuts from the .shortcuts file
    if (trimmedPrefix.endsWith("Shared Folders")) {
      shortcuts = await getShortcuts(trimmedPrefix);
    }

    // Returns combined data and shortcuts
    res.json({
      ...data,
      shortcuts,
    });
  } catch (err) {
    console.error("Error fetching bucket objects:", err);
    res.status(500).send("Error fetching bucket objects: " + err);
  }
};

// Retrieves permissions for a folder (reads '.permissions' file within given folder)
const fetchPermissions = async (req, res) => {
  // Get the folder prefix and the user's name from query
  const { folderKey, user } = req.query;

  try {
    // Uses the getPermissions helper function with raw=true to return all data when possible
    const permissions = await getPermissions(
      folderKey.replace(/\/$/, ""),
      user,
      null,
      true
    );

    // Returns all permissions for provided folder key
    res.json(permissions);
  } catch (err) {
    console.error("Error fetching permissions: ", err);
    res.status(500).send("Error fetching permissions: " + err);
  }
};

// Uploads a file to the specified folder in S3
const uploadFile = async (req, res) => {
  try {
    const prefix = req.body.prefix || "";
    const fileName = req.file?.originalname || req.body.folderName;
    const user = req.body.user || "";

    // Checks if the user has write permissions for this folder
    const isAuthorized = await getPermissions(
      prefix.replace(/\/$/, ""),
      user,
      "write"
    );
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ error: "Access denied: write permission required." });
    }

    // checks to see if user input a name or not
    if (!fileName) {
      return res.status(400).send("Missing file name.");
    }

    // Calls helper function to upload the provided file in the current folder
    const data = await uploadS3Object(req.file, prefix, fileName);
    // Returns success response
    res.json(data);
  } catch (err) {
    console.error("Error uploading file:", err.stack || err);
    res.status(500).send("Error uploading file: " + err);
  }
};

// Creates a new folder in s3
const createFolder = async (req, res) => {
  try {
    const { prefix, folderName, user } = req.body;

    console.log("> Create Folder: %o", req.body);

    // Prevents users from creating a folder without a name
    if (!folderName)
      return res.status(400).json({ error: "Missing folder name." });

    const isAuthorized =
      prefix.startsWith(`users/${user}`) ||
      prefix === "users/" ||
      prefix === `users/${user}/Share Folders`
        ? true // user should be able to create folders anywhere in their folder, allow creation of root user folder
        : await getPermissions(prefix.replace(/\/$/, ""), user, "write");

    if (!isAuthorized)
      return res
        .status(403)
        .json({ error: "Access denied: write permission required." });

    await uploadS3Folder(user, prefix, folderName);

    res.status(200).json({ message: `Folder '${folderName}' created.` });
  } catch (error) {
    console.error("Error creating folder:", error);
    res.status(500).json({ error: "Error creating folder" });
  }
};

// Shares a folder with other users
const shareFolder = async (req, res) => {
  const { folderKey, user, lastModified, targets } = req.body;

  console.log("> Share Folder: %o", req.body);

  // Basic validation of input
  if (!folderKey || !user || !lastModified || !Array.isArray(targets)) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  try {
    // Gets and stores data within the .permissions within the current folder
    const currentPermissions = await getPermissions(
      folderKey.replace(/\/$/, ""),
      user,
      null,
      true
    );

    console.log("> Current permissions:", currentPermissions);

    const userIsFolderOwner = currentPermissions._meta?.owner !== user;

    if (userIsFolderOwner) {
      return res
        .status(403)
        .json({ error: "Only the owner may share this folder" });
    }

    console.log("> User is folder owner, proceeding...");

    // Saves .permissions in a new variable for editing
    let newPermissions = { ...currentPermissions };

    // Loops through list of new permissions provided by the user
    for (const { username, permissions } of targets) {
      // Prefix for other user's Shared Folders folder
      const sharedFolderKey = `users/${username}/Shared Folders/`;

      // Gets .shortcut from the Shared Folders folder
      let userShortcuts = await getShortcuts(
        sharedFolderKey.replace(/\/$/, "")
      );

      console.log("> userShortcuts", userShortcuts);

      // Checks if .shortcut exists,
      // if not the user likely doesnt exist and skips to th next user
      if (userShortcuts === undefined) {
        //TODO: What if user doesn't exist, don't create folder
        console.warn(`User ${username} does not exist, skipping.`);

        await uploadS3Object(
          "{}",
          `${sharedFolderKey.replace(/\/$/, "")}/`,
          ".shortcuts"
        );
      }

      // If the user is given no permissions,
      // they are removed from .permissions and the folder is removed from their .shortcuts
      if (!permissions.read && !permissions.write) {
        if (userShortcuts[folderKey]) {
          delete userShortcuts[folderKey];

          await uploadS3Object(
            JSON.stringify(userShortcuts),
            sharedFolderKey,
            ".shortcuts"
          );
        }

        // Also remove from newPermissions
        if (newPermissions[username]) delete newPermissions[username];

        continue;
      }

      // Add/update the users .shortcuts
      userShortcuts[folderKey] = {
        path: folderKey,
        owner: user,
        lastModified,
      };

      await uploadS3Object(
        JSON.stringify(userShortcuts),
        sharedFolderKey,
        ".shortcuts"
      );

      // Update permissions (!! forces the values to be boolean)
      newPermissions[username] = {
        read: !!permissions.read,
        write: !!permissions.write,
      };
    }

    // Update owner's shortcuts to include the shared folder
    const ownerSharedKey = `users/${user}/Shared Folders/`;
    let ownerShortcuts = await getShortcuts(ownerSharedKey.replace(/\/$/, ""));
    ownerShortcuts[folderKey] = {
      path: folderKey,
      owner: user,
      lastModified,
    };
    await uploadS3Object(
      JSON.stringify(ownerShortcuts),
      ownerSharedKey,
      ".shortcuts"
    );

    // Update .permissions
    await updatePermissions(folderKey, newPermissions);

    res.json({ message: "Folder shared successfully" });
  } catch (err) {
    console.error("Share error:", err);
    return res.status(500).json({ error: "Failed to share folder" });
  }
};

// Endpoint to delete a file from S3
const deleteFile = async (req, res) => {
  const { key, user } = req.body;
  //grabs prefix of last folder in given key
  const prefix = key.substring(0, key.lastIndexOf("/"));

  try {
    // Checks if the user has write permissions for this folder or the folder containing the file
    const isAuthorized = await getPermissions(
      prefix.replace(/\/$/, ""),
      user,
      "write"
    );
    if (!isAuthorized) {
      return res
        .status(403)
        .json({ error: "Access denied: write permission required." });
    }

    // Checks whether the target to be deleted is a folder or a file and calls the corresponding helper function
    if (key.endsWith("/")) {
      await deleteS3Folder(key);
      return res.json({ message: "Folder and its contents deleted." });
    } else {
      await deleteS3File(key);
      return res.json({ message: "File deleted." });
    }
  } catch (error) {
    console.error("Error deleting S3 object:", error);
    res.status(500).json({
      error: "Error deleting S3 object",
      details: error.message,
    });
  }
};

// Generates a temporary signed download URL for a file
const generateDownloadUrl = async (req, res) => {
  const key = req.query.key;

  // Checks if the request is valid
  if (!key) {
    return res.status(400).json({ error: "Missing 'key' parameter" });
  }

  try {
    // Calls the download helper function and returns a JSON containing the result
    const url = await downloadS3Object(key);

    return res.json({ url });
  } catch (err) {
    console.error("Failed to generate download URL:", err);
    return res.status(500).json({ error: "Failed to generate URL" });
  }
};

module.exports = {
  listFiles,
  fetchPermissions,
  uploadFile,
  createFolder,
  shareFolder,
  deleteFile,
  generateDownloadUrl,
};
