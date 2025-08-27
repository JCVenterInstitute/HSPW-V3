const express = require("express");

const submissionController = require("../controllers/submissionController");

const router = express.Router();

router.get("/user/:username", submissionController.fetchSubmissionByUser);

router.get("/:id", submissionController.getSubmissionById);

router.put("/:id", submissionController.updateSubmission);

router.post("/", submissionController.createSubmission);

module.exports = router;
