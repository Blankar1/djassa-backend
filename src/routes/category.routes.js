const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/category.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

router.get("/",          ctrl.getAll);
router.get("/:slug",     ctrl.getOne);
router.post("/",         protect, adminOnly, ctrl.create);
router.put("/:id",       protect, adminOnly, ctrl.update);
router.delete("/:id",    protect, adminOnly, ctrl.remove);

module.exports = router;
