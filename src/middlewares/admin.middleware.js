const ApiError = require("../utils/ApiError");

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  throw new ApiError(403, "Accès réservé aux administrateurs.");
};

module.exports = { adminOnly };
