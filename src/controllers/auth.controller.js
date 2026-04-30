const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { User } = require("../models");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "15m" });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
  });

exports.register = catchAsync(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new ApiError(409, "Cet email est déjà utilisé.");
  const hashed = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, password: hashed, phone });
  const token        = signToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  user.password = undefined;
  res.status(201).json(new ApiResponse(201, { user, token, refreshToken }, "Inscription réussie."));
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !user.password) throw new ApiError(401, "Email ou mot de passe incorrect.");
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, "Email ou mot de passe incorrect.");
  if (!user.isActive) throw new ApiError(403, "Compte désactivé.");
  const token        = signToken(user.id);
  const refreshToken = signRefreshToken(user.id);
  user.password = undefined;
  res.json(new ApiResponse(200, { user, token, refreshToken }, "Connexion réussie."));
});

exports.refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new ApiError(401, "Refresh token manquant.");
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findByPk(decoded.id);
  if (!user || !user.isActive) throw new ApiError(401, "Utilisateur introuvable.");
  const newToken = signToken(user.id);
  res.json(new ApiResponse(200, { token: newToken }, "Token renouvelé."));
});

exports.getMe = catchAsync(async (req, res) => {
  res.json(new ApiResponse(200, req.user));
});

exports.updateProfile = catchAsync(async (req, res) => {
  const { name, phone } = req.body;
  await req.user.update({ name, phone });
  res.json(new ApiResponse(200, req.user, "Profil mis à jour."));
});

exports.changePassword = catchAsync(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findByPk(req.user.id);
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) throw new ApiError(401, "Mot de passe actuel incorrect.");
  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();
  res.json(new ApiResponse(200, null, "Mot de passe modifié."));
});
