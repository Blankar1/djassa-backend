const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const { errorHandler, notFound } = require("./middlewares/error.middleware");

const app = express();

// Sécurité
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

// Rate limiting global
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Trop de requêtes, réessayez plus tard." },
});
app.use("/api", limiter);

// Body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Santé
app.get("/", (req, res) => {
  res.json({ message: "🛒 API DJASSA en ligne", version: "1.0.0" });
});

// Routes API
app.use("/api/v1", routes);

// Erreurs
app.use(notFound);
app.use(errorHandler);

module.exports = app;
