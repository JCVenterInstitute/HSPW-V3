const express = require("express");

const proteinSignatureController = require("../controllers/proteinSignatureController");

const router = express.Router();

router.get("/:id", proteinSignatureController.getProteinSignatureById);

module.exports = router;
