const express = require("express");

const studyProteinController = require("../controllers/studyProteinController");

const router = express.Router();

router.get("/:id", studyProteinController.searchStudyProtein);

router.get(
  "/protein-uniprot/:id",
  studyProteinController.searchStudyProteinUniprot
);

router.post("/", studyProteinController.bulkStudyProteins);

module.exports = router;
