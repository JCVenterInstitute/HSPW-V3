const express = require("express");
const multer = require("multer");

const workspaceController = require("../controllers/workspaceController");

const upload = multer();
const router = express.Router();

router.get("/list-s3-objects", workspaceController.listFiles);

router.get("/get-permissions", workspaceController.fetchPermissions);

router.get("/generate-download-url", workspaceController.generateDownloadUrl);

router.post(
  "/upload-s3-object",
  upload.single("file"),
  workspaceController.uploadFile
);

router.post("/create-folder", express.json(), workspaceController.createFolder);

router.post("/share-folder", workspaceController.shareFolder);

router.delete("/delete-s3-file", workspaceController.deleteFile);

module.exports = router;
