const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/product.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const { uploadImages } = require("../middlewares/upload.middleware");

router.get("/",              ctrl.getAll);
router.get("/:slug",         ctrl.getOne);
router.post("/",             protect, adminOnly, ctrl.create);
router.put("/:id",           protect, adminOnly, ctrl.update);
router.delete("/:id",        protect, adminOnly, ctrl.remove);
router.post("/:id/images",   protect, adminOnly, uploadImages, ctrl.uploadImages);

module.exports = router;
