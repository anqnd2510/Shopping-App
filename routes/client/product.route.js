const express = require("express");
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get("/", controller.index);

router.get("/:slugType", controller.type)

router.get("/detail/:slugProduct", controller.detail);

module.exports = router;