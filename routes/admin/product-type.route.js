const express = require("express");
const multer = require("multer");
const router = express.Router();

const upload = multer();

const controller = require("../../controllers/admin/product-type.controller");
const validate = require("../../validates/admin/product-type.validate");

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");

router.get("/", controller.index);

router.get("/create", controller.create);

router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.createPost
);

router.patch(
    "/edit/:id",
    upload.single("thumbnail"),
    uploadCloud.upload,
    validate.createPost,
    controller.editPatch
);
router.get("/edit/:id", controller.edit);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.deleteItem);

router.patch("/change-status/:status/:id", controller.changeStatus);

module.exports = router;