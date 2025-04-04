const express = require("express");

const geneController = require("../controllers/geneController");

const router = express.Router();

router.get("/:id", geneController.getGeneById);

router.post("/:size/:from", geneController.queryGenes);

module.exports = router;
