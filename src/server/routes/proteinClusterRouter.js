const express = require("express");
const router = express.Router();
const salivaryProteinController = require("../controllers/proteinClusterController");

router.get("/", salivaryProteinController.fetchProteinClusterData);

router.get("/member-count", salivaryProteinController.getClusterMemberCount);

router.get("/:id", salivaryProteinController.getProteinClusterById);

router.post("/:size/:from", salivaryProteinController.queryProteinCluster);

module.exports = router;
