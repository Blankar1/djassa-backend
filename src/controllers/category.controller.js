const slugify = require("slugify");
const { Category, Product } = require("../models");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

exports.getAll = catchAsync(async (req, res) => {
  const categories = await Category.findAll({
    where: { isActive: true },
    order: [["order", "ASC"]],
  });
  res.json(new ApiResponse(200, categories));
});

exports.getOne = catchAsync(async (req, res) => {
  const cat = await Category.findOne({ where: { slug: req.params.slug } });
  if (!cat) throw new ApiError(404, "Catégorie introuvable.");
  res.json(new ApiResponse(200, cat));
});

exports.create = catchAsync(async (req, res) => {
  const { name, description, image, order } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const cat = await Category.create({ name, slug, description, image, order });
  res.status(201).json(new ApiResponse(201, cat, "Catégorie créée."));
});

exports.update = catchAsync(async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat) throw new ApiError(404, "Catégorie introuvable.");
  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  await cat.update(req.body);
  res.json(new ApiResponse(200, cat, "Catégorie mise à jour."));
});

exports.remove = catchAsync(async (req, res) => {
  const cat = await Category.findByPk(req.params.id);
  if (!cat) throw new ApiError(404, "Catégorie introuvable.");
  await cat.destroy();
  res.json(new ApiResponse(200, null, "Catégorie supprimée."));
});
