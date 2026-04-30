const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/order.controller");
const { protect } = require("../middlewares/auth.middleware");
const { adminOnly } = require("../middlewares/admin.middleware");

router.post("/",              ctrl.createOrder);
router.get("/my-orders",      protect, ctrl.getMyOrders);
router.get("/",               protect, adminOnly, ctrl.getAllAdmin);
router.get("/:id",            protect, ctrl.getOne);
router.patch("/:id/status",   protect, adminOnly, ctrl.updateStatus);

module.exports = router;
