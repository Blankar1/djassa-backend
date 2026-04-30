const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth.controller");
const { protect } = require("../middlewares/auth.middleware");

router.post("/register", authCtrl.register);
router.post("/login",    authCtrl.login);
router.post("/refresh",  authCtrl.refreshToken);
router.get("/me",        protect, authCtrl.getMe);
router.patch("/me",      protect, authCtrl.updateProfile);
router.patch("/me/password", protect, authCtrl.changePassword);

module.exports = router;
