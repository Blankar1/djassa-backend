const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const catchAsync = require("../utils/catchAsync");

const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Non autorisé. Token manquant.");
  }
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id, {
    attributes: { exclude: ["password", "resetPasswordToken", "resetPasswordExpires"] },
  });
  if (!user || !user.isActive) throw new ApiError(401, "Utilisateur introuvable ou désactivé.");
  req.user = user;
  next();
});

module.exports = { protect };
