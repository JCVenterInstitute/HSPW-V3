const express = require("express");
const router = express.Router();
const salivaryProteinController = require("../controllers/salivaryProteinController");

router.get("/:id", salivaryProteinController.getSalivaryProteinById);

router.post("/:size/:from", salivaryProteinController.querySalivaryProtein);

module.exports = router;
