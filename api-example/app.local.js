const express = require("express");
const app = require("./src/app");
const port = 3000;

express().use("/", app).listen(port);
console.info(`listening on http://localhost:${port}`);
