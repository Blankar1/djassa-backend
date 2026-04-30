const express = require("express");
const router = express.Router();

router.use("/auth",       require("./auth.routes"));
router.use("/categories", require("./category.routes"));
router.use("/products",   require("./product.routes"));
router.use("/orders",     require("./order.routes"));
router.use("/admin",      require("./admin.routes"));

module.exports = router;
