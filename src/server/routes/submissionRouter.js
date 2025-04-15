const express = require("express");

const submissionController = require("../controllers/submissionController");

const router = express.Router();

router.get("/:username", submissionController.fetchSubmissionByUser);

router.put("/:id", submissionController.updateSubmission);

router.post("/", submissionController.createSubmission);

module.exports = router;
