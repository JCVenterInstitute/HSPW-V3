const express = require("express");

const studyController = require("../controllers/studyController");

const router = express.Router();

router.get("/", studyController.searchAllStudy);

router.post("/", studyController.bulkStudySearch);

router.get("/:id", studyController.searchStudy);

module.exports = router;
