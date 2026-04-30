const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");
const ctrl = require("../controllers/admin.controller");

router.use(protect, adminOnly);
router.get("/dashboard", ctrl.getDashboard);

module.exports = router;
