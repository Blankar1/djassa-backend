const ApiError = require("../utils/ApiError");

const notFound = (req, res, next) => {
  next(new ApiError(404, `Route introuvable : ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
  let { statusCode = 500, message } = err;

  if (err.name === "SequelizeValidationError") {
    statusCode = 422;
    message = err.errors.map((e) => e.message).join(", ");
  }
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 409;
    message = "Cette valeur existe déjà.";
  }
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token invalide.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expiré, veuillez vous reconnecter.";
  }

  if (process.env.NODE_ENV === "development") {
    console.error("❌", err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
