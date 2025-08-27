const express = require("express");

const citationController = require("../controllers/citationController");

const router = express.Router();

router.get("/:id", citationController.getCitationById);

router.post("/:size/:from/", citationController.queryCitationData);

module.exports = router;
