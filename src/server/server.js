const express = require("express");
const cors = require("cors");
const axios = require("axios");
const { Client } = require("@opensearch-project/opensearch");
const { defaultProvider } = require("@aws-sdk/credential-provider-node");
const createAwsOpensearchConnector = require("aws-opensearch-connector");
const path = require("path");
const multer = require("multer");
const fernet = require("fernet");

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
} = require("./utils/s3Utils.js");

const { processGroupData } = require("./utils/processGroupData");
const { processFile } = require("./utils/processFile");
const { s3Download, checkFileExists } = require("./utils/s3Download");
const { s3Upload } = require("./utils/s3Upload");
const { formQuery } = require("./utils/formQuery");
const { generatePresignedUrls } = require("./utils/generatePresignedUrls");
const { createContact } = require("./utils/createContact");
const { getSSMParameter } = require("./utils/utils");
const { sendSupportEmail } = require("./utils/sendSupportEmail");

const salivaryProteinRouter = require("./routes/salivaryProteinRouter");
const proteinClusterRouter = require("./routes/proteinClusterRouter");
const citationRouter = require("./routes/citationRouter");
const studyProteinRouter = require("./routes/studyProteinRouter");
const geneRouter = require("./routes/geneRouter");
const proteinSignatureRouter = require("./routes/proteinSignatureRouter");
const studyRouter = require("./routes/studyRouter");
const submissionRouter = require("./routes/submissionRouter");
const upload = multer();

const app = express();

app.use(cors());
app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(express.static("build"));
app.use("/static", express.static(path.join(__dirname, "./build/static")));
app.use("/doc", express.static(path.join(__dirname, "./documentation/")));

app.use("/api/salivary-proteins", salivaryProteinRouter);
app.use("/api/protein-cluster", proteinClusterRouter);
app.use("/api/citations", citationRouter);
app.use("/api/study-protein", studyProteinRouter);
app.use("/api/genes", geneRouter);
app.use("/api/protein-signature", proteinSignatureRouter);
app.use("/api/study", studyRouter);
app.use("/api/submissions", submissionRouter);

const host = process.env.OS_HOSTNAME;

const getClient = async () => {
  const awsCredentials = await defaultProvider()();
  const connector = createAwsOpensearchConnector({
    credentials: awsCredentials,
    region: process.env.AWS_REGION ?? "us-east-2",
    getCredentials: function (cb) {
      return cb();
    },
  });
  return new Client({
    ...connector,
    node: host,
  });
};

/*****************************
 * Salivary Proteins Endpoints
 *****************************/

async function queryProteins(size, from, filter, sort = null, keyword = null) {
  const client = await getClient();

  const payload = {
    index: process.env.INDEX_SALIVARY_PROTEIN,
    body: {
      track_total_hits: true,
      size: size,
      from: from,
      query: {
        bool: {
          should: [...filter],
        },
      },
      ...(sort && { sort }), // Apply sort if present
    },
  };

  const response = await client.search(payload);

  return response.body;
}

// Used by Protein Search to get back matches to a list of salivary protein ids
app.post("/api/proteins/:size/:from/", (req, res) => {
  const { filters, sort, keyword } = req.body;
  const { size, from } = req.params;

  const results = queryProteins(size, from, filters, sort, keyword);

  results.then((result) => {
    res.json(result);
  });
});

/******************************
 * For Homepage Chord Component
 ******************************/

async function getCount() {
  var client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_SALIVARY_SUMMARY, // Replace with your index name
    body: {
      size: 0,
      aggs: {
        filter_whole_saliva: {
          filter: {
            bool: {
              must: [{ range: { saliva_abundance: { gt: 0 } } }],
            },
          },
        },
        filter_whole_saliva_only: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { "sm/sl_abundance": { lte: 0 } } },
                { range: { plasma_abundance: { lte: 0 } } },
                { range: { parotid_gland_abundance: { lte: 0 } } },
              ],
            },
          },
        },
        filter_smsl_glands: {
          filter: {
            bool: {
              must: [{ range: { "sm/sl_abundance": { gt: 0 } } }],
            },
          },
        },
        filter_smsl_glands_only: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { lte: 0 } } },
                { range: { "sm/sl_abundance": { gt: 0 } } },
                { range: { plasma_abundance: { lte: 0 } } },
                { range: { parotid_gland_abundance: { lte: 0 } } },
              ],
            },
          },
        },
        filter_blood_plasma: {
          filter: {
            bool: {
              must: [{ range: { plasma_abundance: { gt: 0 } } }],
            },
          },
        },
        filter_blood_plasma_only: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { lte: 0 } } },
                { range: { "sm/sl_abundance": { lte: 0 } } },
                { range: { plasma_abundance: { gt: 0 } } },
                { range: { parotid_gland_abundance: { lte: 0 } } },
              ],
            },
          },
        },
        filter_parotid_glands: {
          filter: {
            bool: {
              must: [{ range: { parotid_gland_abundance: { gt: 0 } } }],
            },
          },
        },
        filter_parotid_glands_only: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { lte: 0 } } },
                { range: { "sm/sl_abundance": { lte: 0 } } },
                { range: { plasma_abundance: { lte: 0 } } },
                { range: { parotid_gland_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_whole_saliva_and_smsl_glands: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { "sm/sl_abundance": { gt: 0 } } },
              ],
            },
          },
        },
        filter_whole_saliva_and_blood_plasma: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { plasma_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_whole_saliva_and_parotid_glands: {
          filter: {
            bool: {
              must: [
                { range: { saliva_abundance: { gt: 0 } } },
                { range: { parotid_gland_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_smsl_glands_and_blood_plasma: {
          filter: {
            bool: {
              must: [
                { range: { "sm/sl_abundance": { gt: 0 } } },
                { range: { plasma_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_smsl_glands_and_parotid_glands: {
          filter: {
            bool: {
              must: [
                { range: { "sm/sl_abundance": { gt: 0 } } },
                { range: { parotid_gland_abundance: { gt: 0 } } },
              ],
            },
          },
        },
        filter_blood_plasma_and_parotid_glands: {
          filter: {
            bool: {
              must: [
                { range: { plasma_abundance: { gt: 0 } } },
                { range: { parotid_gland_abundance: { gt: 0 } } },
              ],
            },
          },
        },
      },
    },
  });

  return response.body.aggregations;
}

app.get("/api/getChordPlotCount", (req, res) => {
  getCount().then((result) => res.json(result));
});

/*******************
 * Go Node Endpoints
 *******************/

const searchGoNodesType = async (type) => {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      query_string: {
        query: `*type*`,
        fields: [],
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_GO_NODES,
    body: query,
  });
  return response.body.hits.hits;
};

app.get("/api/go-nodes-type/:type", (req, res) => {
  let a = searchGoNodesType(req.params.type);
  a.then(function (result) {
    res.json(result);
  });
});

const searchGoNodes = async (id) => {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      query_string: {
        default_field: "id",
        query: id,
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_GO_NODES,
    body: query,
  });
  return response.body.hits.hits;
};

app.get("/api/go-nodes/:id", (req, res) => {
  let a = searchGoNodes(req.params.id);
  a.then(function (result) {
    res.json(result);
  });
});

const searchGoEdges = async (id) => {
  var client = await getClient();

  var query = {
    size: 10000,
    query: {
      query_string: {
        query: `*GO*${id}*`,
        fields: [],
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_GO_EDGES,
    body: query,
  });

  return response.body.hits.hits;
};

app.get("/api/go-edges/:id", (req, res) => {
  let a = searchGoEdges(req.params.id);
  a.then(function (result) {
    res.json(result);
  });
});

const searchGoNodesUsage = async (id) => {
  // Initialize the client.
  var client = await getClient();

  var query = {
    size: 10000,
    _source: ["id"],
    query: {
      query_string: {
        query: `*GO*${id}*`,
        fields: [],
      },
    },
  };

  const response = await client.search({
    index: process.env.INDEX_SALIVARY_PROTEIN,
    body: query,
  });
  return response.body.hits.hits;
};

app.get("/api/go-nodes-usage/:id", (req, res) => {
  let a = searchGoNodesUsage(req.params.id);
  a.then(function (result) {
    res.json(result);
  });
});

/**********************************
 * For Protein Signature Pie Chart
 *********************************/

async function getProteinSignatureTypeCounts() {
  var client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_PROTEIN_SIGNATURE,
    body: {
      size: 0,
      aggs: {
        langs: {
          terms: { field: "Type.keyword", size: 500 },
        },
      },
    },
  });
  return response.body.aggregations.langs.buckets;
}

app.get("/api/signature-type-counts/", (req, res) => {
  let a = getProteinSignatureTypeCounts();
  a.then(function (result) {
    res.json(result);
  });
});

/*************************
 * For Gene Page Bar Graph
 *************************/

async function getGeneLocationCounts() {
  const client = await getClient();

  // Build chromosome list: numeric 1..22 and X,Y
  const chromosomes = Array.from({ length: 22 }, (_, i) =>
    String(i + 1)
  ).concat(["X", "Y"]);

  // Create aggregations programmatically to avoid repetition
  const aggs = chromosomes.reduce((acc, chr) => {
    const pattern = /^[0-9]+$/.test(chr)
      ? `${chr}[qp].*`
      : `${chr.toLowerCase()}[pq].*`;
    acc[chr] = {
      filter: { regexp: { Location: pattern } },
      aggs: {
        doc_count: {
          value_count: { field: "_id" },
        },
      },
    };
    return acc;
  }, {});

  const response = await client.search({
    index: process.env.INDEX_GENE,
    body: { size: 0, aggs },
  });

  return response.body.aggregations;
}

app.get("/api/gene-location-counts/", (req, res) => {
  let a = getGeneLocationCounts();
  a.then(function (result) {
    res.json(result);
  });
});

/***********************************
 * Differential Expression Endpoints
 ***********************************/

app.post("/api/differential-expression/analyze", async (req, res) => {
  try {
    const {
      inputData = null,
      groupNames = null,
      logNorm,
      numberOfDifferentiallyAbundantProteinsInHeatmap,
      foldChangeThreshold,
      pValueThreshold,
      pValueType,
      parametricTest,
      timestamp,
      formattedDate,
      username,
    } = req.body;

    let inputFile;

    console.log("> Request Body: %o", req.body);

    // Ping Lambdas to prevent cold start when trying to run analysis
    await Promise.all([
      axios.get(process.env.BASIC_ANALYSIS_API).then((res) => res.data),
      axios.get(process.env.ADVANCE_ANALYSIS_API).then((res) => res.data),
    ]);

    if (inputData) {
      // Processing user provided file
      inputFile = await processFile(
        inputData,
        timestamp,
        formattedDate,
        username
      );
    } else {
      // Processing data from HSP
      inputFile = await processGroupData(
        req.body,
        timestamp,
        formattedDate,
        groupNames,
        username
      );
    }

    const basicAnalysisRequestBody = {
      username: username ? username : "test-user-local",
      input_file: inputFile,
      log_normalized: logNorm,
      stat_test: parametricTest,
      p_raw: pValueType,
      foldChangeThreshold,
      pValueThreshold,
      heat_map_number: numberOfDifferentiallyAbundantProteinsInHeatmap,
    };

    console.log("> Input file location:", inputFile);
    console.log("> Basic Analysis Request Body: %o", basicAnalysisRequestBody);

    // Submit basic differential expression analysis
    // Ignore timeout since the analysis takes a while to run
    // API will time out, but analysis still runs
    axios
      .post(process.env.BASIC_ANALYSIS_API, basicAnalysisRequestBody)
      .catch((err) =>
        console.error(
          "Basic analysis API call timed out:",
          err?.response?.status ?? err.code,
          err?.message
        )
      );

    console.log("> Done");

    return res.status(200).send("Basic analysis complete");
  } catch (error) {
    console.log("> Error", error);
    console.error(`Error message: ${error.message}`);
    res.status(500).send(`Server Error: ${error.message}`);
  }
});

app.post(
  "/api/differential-expression/send-support-email",
  async (req, res) => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    const timestamp = {
      year,
      month,
      day,
      hours,
      minutes,
      seconds,
    };
    try {
      const { message } = req.body;

      const newEmail = await sendSupportEmail({
        message,
        timestamp,
      });

      console.log("Support email sent.");
      res.status(201).json({ message: "Support email sent.", newEmail });
    } catch (error) {
      console.error("Error in API endpoint: ", error);
      res.status(500).send("Error sending email");
    }
  }
);

app.post("/api/decrypt", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) return res.status(400).json({ error: "Missing token" });

    console.log("> Received token:", token);

    // Token was URL-encoded when created in lambda
    const tokenStr = decodeURIComponent(token);
    const secretKey = await getSSMParameter(process.env.SECRET_PARAM);

    if (!secretKey) {
      console.error("> No secret key found in SSM");
      return res.status(500).json({ error: "Encryption key not configured" });
    }

    const secret = new fernet.Secret(secretKey);

    const ftoken = new fernet.Token({
      secret: secret,
      token: tokenStr,
      ttl: 0,
    });

    let plaintext;

    try {
      plaintext = ftoken.decode(); // plaintext JSON string
    } catch (err) {
      console.error("> Failed to decode token:", err);
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const data = JSON.parse(plaintext);

    console.log("> Decrypted data:", data);

    return res.json({ data });
  } catch (err) {
    console.error("Error in /api/decrypt:", err);
    return res.status(500).json({ error: "Server error decrypting token" });
  }
});

/*****************************
 * S3 Explorer Endpoints
 *****************************/

// Lists files, folders, and shortcuts in a given s3 prefix for a user
// expects a folder prefix ending in '/'
app.get("/api/list-s3-objects", async (req, res) => {
  // Get the folder prefix and the user's name from query
  const { prefix, user } = req.query;

  try {
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
});

// Retrieves permissions for a folder (reads '.permissions' file within given folder)
app.get("/api/get-permissions", async (req, res) => {
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
});

// Uploads a file to s3
app.post("/api/upload-s3-object", upload.single("file"), async (req, res) => {
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
});

// Creates a new folder in s3
app.post("/api/create-folder", express.json(), async (req, res) => {
  try {
    const { prefix, folderName, user } = req.body;

    // Prevents users from creating a folder without a name
    if (!folderName)
      return res.status(400).json({ error: "Missing folder name." });

    const isAuthorized = prefix.startsWith(`users/${user}/`)
      ? true // user should be able to create folders anywhere in their folder
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
});

// Shares a folder with other users
app.post("/api/share-folder", async (req, res) => {
  const { folderKey, user, lastModified, targets } = req.body;

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

      // Checks if .shortcut exists,
      // if not the user likely doesnt exist and skips to th next user
      if (userShortcuts === undefined) {
        console.warn(`User ${username} does not exist, skipping.`);
        continue;
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
    const ownerSharedKey = `${user}/Shared Folders/`;
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
});

// Endpoint to delete a file from S3
app.delete("/api/delete-s3-file", async (req, res) => {
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
});

// Generates a temporary signed download URL for a file
app.get("/api/generate-download-url", async (req, res) => {
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
});

/*********************
 * Misc Util Endpoints
 *********************/

app.get("/api/download-template-data", async (req, res) => {
  // S3 download parameters
  const params = {
    bucketName: `${process.env.DIFFERENTIAL_S3_BUCKET}`,
    s3Key: "inputdata.csv",
  };

  const presignedUrl = await s3Download(params);
  res.send({ url: presignedUrl });
});

app.get("/api/download-data-standard", async (req, res) => {
  // S3 download parameters
  const params = {
    bucketName: `${process.env.DIFFERENTIAL_S3_BUCKET}`,
    s3Key: "example_inputdata_template.xlsx",
  };

  const presignedUrl = await s3Download(params);
  res.send({ url: presignedUrl });
});

app.get("/api/go-kegg-check", async (req, res) => {
  const { jobId } = req.query;

  const s3Key = `${jobId}/gsemf.tsv`;

  const fileExists = await checkFileExists(
    process.env.DIFFERENTIAL_S3_BUCKET,
    s3Key
  );

  return res.send({ exists: fileExists });
});

app.get("/api/getJSONFile", async (req, res) => {
  const { s3Key } = req.query;
  const bucketName = process.env.DIFFERENTIAL_S3_BUCKET;

  if (!s3Key) {
    return res.status(400).json({ error: "Missing s3Key parameter." });
  }

  try {
    const presignedUrl = await s3Download({ bucketName, s3Key });
    res.json({ url: presignedUrl });
  } catch (error) {
    res.status(500).json({
      error: "Error generating S3 presigned URL.",
      details: error.message,
    });
  }
});

app.post("/api/s3JSONUpload", async (req, res) => {
  const { s3Key, jsonData } = req.body;
  if (!jsonData || !s3Key) return res.status(400).send("No data received.");

  try {
    const result = await s3Upload({
      bucketName: `${process.env.DIFFERENTIAL_S3_BUCKET}`,
      s3Key: s3Key,
      data: Buffer.from(JSON.stringify(jsonData)),
      contentType: "application/json",
    });
    res.json({ message: "JSON uploaded to S3!", s3Result: result });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Upload to S3 failed.", details: err.message });
  }
});

app.get("/api/s3Download", async (req, res) => {
  try {
    const { s3Path, fileName } = req.query;

    if (!s3Path || !fileName) {
      return res
        .status(400)
        .json({ error: "Missing s3Path or fileName parameter." });
    }

    const params = {
      bucketName: `${process.env.DIFFERENTIAL_S3_BUCKET}`,
      s3Key: `${s3Path}/${fileName}`,
    };

    const presignedUrl = await s3Download(params);

    res.send({ url: presignedUrl }); // Send the presigned URL to the client
  } catch (error) {
    console.log(error);
    res.status(500).send("Error generating presigned URL");
  }
});

const getProperties = async (index) => {
  // Initialize the client.
  const client = await getClient();

  try {
    // Get the mapping of the specified index.
    const response = await client.indices.getMapping({ index: index });
    return response.body[`${index}`].mappings.properties;
  } catch (error) {
    // Handle any errors that occur during the API call.
    console.error("Error getting mapping:", error);
    throw error;
  }
};

const getSalivaryProperties = async (index) => {
  // Initialize the client.
  const client = await getClient();

  try {
    // Get the mapping of the specified index.
    const response = await client.indices.getMapping({ index: index });

    // return response.body[`${index}`].mappings.properties["Salivary Proteins"]
    //   .properties;
    return response.body[`${index}`].mappings.properties["salivary_proteins"]
      .properties;
  } catch (error) {
    // Handle any errors that occur during the API call.
    console.error("Error getting mapping:", error);
    throw error;
  }
};

app.get("/api/properties/:entity", async (req, res) => {
  const entity = req.params.entity;
  console.log(`Getting properties for entity: ${entity}`);

  const entityIndexMapping = {
    Genes: process.env.INDEX_GENE,
    "Protein Clusters": process.env.INDEX_PROTEIN_CLUSTER,
    "Protein Signatures": process.env.INDEX_PROTEIN_SIGNATURE,
    Proteins: process.env.INDEX_STUDY_PROTEIN,
    "PubMed Citations": process.env.INDEX_CITATION,
    "Salivary Proteins": process.env.INDEX_SALIVARY_PROTEIN,
    Annotations: process.env.INDEX_SALIVARY_PROTEIN,
  };

  if (entity === "Salivary Proteins") {
    await getSalivaryProperties(entityIndexMapping[entity]).then(
      (properties) => {
        const result = [];
        for (const [key, value] of Object.entries(properties)) {
          if (key !== "annotations" && key !== "atlas" && key !== "glycans") {
            if (value.properties) {
              for (const subKey in value.properties) {
                if (value.properties[subKey].properties) {
                  // Handle another level of nested properties
                  for (const nestedKey in value.properties[subKey].properties) {
                    result.push(`${key}.${subKey}.${nestedKey}`);
                  }
                } else {
                  result.push(`${key}.${subKey}`);
                }
              }
            } else {
              result.push(key);
            }
          }
        }
        res.json(result);
      }
    );
  } else if (entity === "Annotations") {
    await getSalivaryProperties(entityIndexMapping[entity]).then(
      (properties) => {
        const result = [];
        for (const [key, value] of Object.entries(properties)) {
          if (key === "annotations") {
            if (value.properties) {
              for (const subKey in value.properties) {
                if (subKey !== "features") {
                  if (value.properties[subKey].properties) {
                    // Handle another level of nested properties
                    for (const nestedKey in value.properties[subKey]
                      .properties) {
                      if (nestedKey !== "evidences") {
                        result.push(`${subKey}.${nestedKey}`);
                      }
                    }
                  } else {
                    result.push(`${subKey}`);
                  }
                }
              }
            }
          } else if (key === "uniprot_accession") {
            result.push(key);
          }
        }
        res.json(result);
      }
    );
  } else {
    await getProperties(entityIndexMapping[entity]).then((properties) => {
      const result = [];
      for (const [key, value] of Object.entries(properties)) {
        result.push(key);
      }
      res.json(result);
    });
  }
});

const advancedSearch = async ({
  entity,
  rows,
  booleanOperator,
  selectedProperties,
  size,
  from,
  paginationKey,
  sortedColumn,
}) => {
  // Initialize the client.
  const client = await getClient();

  const entityIndexMapping = {
    Genes: process.env.INDEX_GENE,
    "Protein Clusters": process.env.INDEX_PROTEIN_CLUSTER,
    "Protein Signatures": process.env.INDEX_PROTEIN_SIGNATURE,
    Proteins: process.env.INDEX_STUDY_PROTEIN,
    "PubMed Citations": process.env.INDEX_CITATION,
    "Salivary Proteins": process.env.INDEX_SALIVARY_PROTEIN,
    Annotations: process.env.INDEX_SALIVARY_PROTEIN,
  };

  const query = await formQuery(
    entity,
    rows,
    booleanOperator,
    selectedProperties,
    size,
    from,
    paginationKey,
    sortedColumn
  );

  const response = await client.search({
    index: entityIndexMapping[entity],
    body: query,
  });

  return response.body.hits;
};

app.post("/api/advanced-search/build-query", async (req, res) => {
  try {
    const payload = req.body;

    const result = await advancedSearch(payload);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/contact/generate-presigned-urls", async (req, res) => {
  const { fileNames, topic, timestamp } = req.body;
  const bucketName = process.env.CONTACT_S3_BUCKET;

  try {
    const urls = await generatePresignedUrls(
      bucketName,
      fileNames,
      topic,
      timestamp
    );
    res.json({ urls });
  } catch (error) {
    console.error("Error in endpoint: ", error);
    res.status(500).send("Error generating URLs");
  }
});

const verifyCaptcha = async (captchaResponse) => {
  const secretKey = await getSSMParameter(process.env.RECAPTCHA_SECRET_KEY);
  const verificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captchaResponse}`;

  try {
    const response = await axios.post(verificationUrl);
    const data = response.data;

    // Google reCAPTCHA response contains a success boolean
    if (data.success) {
      console.log("CAPTCHA verification successful");
      return true;
    } else {
      console.log("CAPTCHA verification failed", data["error-codes"]);
      return false;
    }
  } catch (error) {
    console.error("Error during CAPTCHA verification", error);
    return false;
  }
};

app.post("/api/contact/send-form", async (req, res) => {
  try {
    const {
      name,
      email,
      pageUrl,
      topic,
      message,
      s3Locations,
      ratings,
      timestamp,
      captchaResponse,
    } = req.body;

    // Verify the CAPTCHA response
    const isCaptchaValid = await verifyCaptcha(captchaResponse);

    if (!isCaptchaValid) {
      return res
        .status(400)
        .send({ message: "Invalid CAPTCHA. Please try again." });
    }

    const newContact = await createContact({
      name,
      email,
      pageUrl,
      topic,
      message,
      s3Locations,
      ratings,
      timestamp,
    });

    res
      .status(201)
      .json({ message: "Contact created successfully", newContact });
  } catch (error) {
    console.error("Error in API endpoint: ", error);
    res.status(500).send("Error creating contact");
  }
});

const globalSearch = async ({
  entity,
  size,
  from,
  searchText,
  sortedColumn,
}) => {
  // Initialize the client.
  const client = await getClient();

  const entityIndexMapping = {
    Genes: process.env.INDEX_GENE,
    "Protein Clusters": process.env.INDEX_PROTEIN_CLUSTER,
    "Protein Signatures": process.env.INDEX_PROTEIN_SIGNATURE,
    Proteins: process.env.INDEX_STUDY_PROTEIN,
    "PubMed Citations": process.env.INDEX_CITATION,
    "Salivary Proteins": process.env.INDEX_SALIVARY_PROTEIN,
  };

  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  const escapedInput = escapeSpecialCharacters(searchText);

  const notKeywordList = [
    "Gene Name",
    "number_of_members",
    "experiment_id_key",
    "Name",
    "Date of Publication",
    "PubDate",
    "salivary_proteins.protein_sequence_length",
    "salivary_proteins.mass",
  ];

  const query = {
    track_total_hits: true,
    size,
    from,
    query: {
      query_string: {
        query: `*${escapedInput}*`, // Search for the keyword in all fields
        analyze_wildcard: true, // Enable wildcard search
      },
    },
    ...(sortedColumn && {
      sort: [
        {
          [notKeywordList.includes(sortedColumn.attribute)
            ? `${sortedColumn.attribute}`
            : sortedColumn.attribute === "salivary_proteins.keywords"
              ? `${sortedColumn.attribute}.keyword.keyword`
              : `${sortedColumn.attribute}.keyword`]: {
            order: sortedColumn.order,
          },
        },
      ],
    }),
  };

  const response = await client.search({
    index: entityIndexMapping[entity],
    body: query,
  });

  return response.body.hits;
};

app.post("/api/global-search", async (req, res) => {
  try {
    const payload = req.body;

    const result = await globalSearch(payload);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

const experimentProtein = async ({
  size,
  from,
  experiment_id_key,
  searchText,
  sortedColumn,
}) => {
  // Initialize the client.
  const client = await getClient();

  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // Escape and trim searchText if it is not null or undefined
  const escapedInput = searchText ? escapeSpecialCharacters(searchText) : "";

  const query = {
    track_total_hits: true,
    size,
    from,
    query: {
      bool: {
        must: [
          {
            query_string: {
              default_field: "experiment_id_key",
              query: experiment_id_key,
            },
          },
          // Include searchText condition only if it is non-empty after trimming and escaping
          ...(escapedInput
            ? [
                {
                  query_string: {
                    query: `*${escapedInput}*`,
                    analyze_wildcard: true,
                  },
                },
              ]
            : []),
        ],
      },
    },
    ...(sortedColumn && {
      sort: [
        {
          [`${sortedColumn.attribute}.keyword`]: {
            order: sortedColumn.order,
          },
        },
      ],
    }),
  };

  const response = await client.search({
    index: process.env.INDEX_STUDY_PROTEIN,
    body: query,
  });

  return response.body.hits;
};

app.post("/api/experiment-protein", async (req, res) => {
  try {
    const payload = req.body;

    const result = await experimentProtein(payload);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

const experimentPeptide = async (
  { size, from, searchText, sortedColumn },
  uniprotid
) => {
  // Initialize the client.
  const client = await getClient();

  const escapeSpecialCharacters = (inputVal) => {
    return inputVal.trim().replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // Escape and trim searchText if it is not null or undefined
  const escapedInput = searchText ? escapeSpecialCharacters(searchText) : "";

  const query = {
    track_total_hits: true,
    size,
    from,
    query: {
      bool: {
        must: [
          {
            query_string: {
              default_field: "Uniprot_accession",
              query: uniprotid,
            },
          },
          // Include searchText condition only if it is non-empty after trimming and escaping
          ...(escapedInput
            ? [
                {
                  query_string: {
                    query: `*${escapedInput}*`,
                    analyze_wildcard: true,
                  },
                },
              ]
            : []),
        ],
      },
    },
    ...(sortedColumn && {
      sort: [
        {
          [`${sortedColumn.attribute}.keyword`]: {
            order: sortedColumn.order,
          },
        },
      ],
    }),
  };

  const response = await client.search({
    index: process.env.INDEX_PEPTIDE,
    body: query,
  });

  return response.body.hits;
};

app.post("/api/experiment-protein/:uniprotid", async (req, res) => {
  try {
    const uniprotid = req.params.uniprotid;
    const payload = req.body;

    const result = await experimentPeptide(payload, uniprotid);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
});

/**********************************
 * For Fetching Abundance Scores
 *********************************/

const getAbundanceData = async (proteinId) => {
  var client = await getClient();

  const response = await client.search({
    index: process.env.INDEX_STUDY_PEPTIDE_ABUNDANCE,
    body: {
      query: {
        bool: {
          filter: [
            {
              term: {
                "uniprot_id.keyword": proteinId,
              },
            },
          ],
        },
      },
    },
  });

  const results = response.body.hits.hits;

  return results.map((res) => res._source);
};

app.get("/api/abundance-score/:id", (req, res) => {
  const abundanceData = getAbundanceData(req.params.id);
  abundanceData.then(function (result) {
    res.json(result);
  });
});

/**********************************
 * Get Max of Whole Saliva, Parotid Glands, SM/SL Glands, Blood, and mRNA
 *********************************/

/**
 * Retrieve max and sum aggregations for a set of salivary-related fields.
 * The aggregation object is built programmatically from a short list of fields
 * to avoid repetitive boilerplate and make the function easier to extend.
 */
const getSalivaryMaxAndSum = async () => {
  const client = await getClient();

  // Fields to aggregate on. Keys may contain characters (like '/') so we
  // generate safe aggregation names by replacing non-word characters with '_'.
  const fields = [
    "sm/sl_abundance",
    "plasma_abundance",
    "mRNA",
    "saliva_abundance",
    "parotid_gland_abundance",
    "SM",
    "SL",
    "PAR",
  ];

  const aggs = fields.reduce((acc, field) => {
    const safeName = field.replace(/[^A-Za-z0-9_]/g, "_");
    acc[`${safeName}_max`] = { max: { field } };
    acc[`${safeName}_sum`] = { sum: { field } };
    return acc;
  }, {});

  const response = await client.search({
    index: process.env.INDEX_SALIVARY_SUMMARY,
    body: {
      size: 0,
      aggs,
    },
  });

  return response.body.aggregations;
};

app.get("/api/get-salivary-max-and-sum", (req, res) => {
  const data = getSalivaryMaxAndSum();
  data.then(function (result) {
    res.json(result);
  });
});

app.get("/doc/*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "./documentation/"),
  });
});

app.get("*", function (req, res) {
  res.sendFile("index.html", {
    root: path.join(__dirname, "./build/"),
  });
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
