const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/outlet.controller");

router.get("/", controller.index);

router.get("/:slug", controller.detail);

module.exports = router;