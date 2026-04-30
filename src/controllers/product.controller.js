const slugify = require("slugify");
const { Op } = require("sequelize");
const { Product, Category, Review } = require("../models");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { getPagination, getPagingData } = require("../utils/pagination");

exports.getAll = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const { search, categoryId, minPrice, maxPrice, status = "active", sort = "createdAt", order = "DESC" } = req.query;

  const where = { status };
  if (search)     where.name = { [Op.iLike]: `%${search}%` };
  if (categoryId) where.categoryId = categoryId;
  if (minPrice || maxPrice)
    where.price = {
      ...(minPrice && { [Op.gte]: minPrice }),
      ...(maxPrice && { [Op.lte]: maxPrice }),
    };

  const data = await Product.findAndCountAll({
    where,
    include: [{ model: Category, as: "category", attributes: ["id", "name", "slug"] }],
    order: [[sort, order.toUpperCase()]],
    limit,
    offset,
  });
  res.json(new ApiResponse(200, getPagingData(data, page, limit)));
});

exports.getOne = catchAsync(async (req, res) => {
  const product = await Product.findOne({
    where: { slug: req.params.slug, status: "active" },
    include: [
      { model: Category, as: "category" },
      { model: Review, as: "reviews", where: { isApproved: true }, required: false,
        include: [{ association: "user", attributes: ["id", "name"] }] },
    ],
  });
  if (!product) throw new ApiError(404, "Produit introuvable.");
  res.json(new ApiResponse(200, product));
});

exports.create = catchAsync(async (req, res) => {
  const { name } = req.body;
  const slug = slugify(name, { lower: true, strict: true });
  const product = await Product.create({ ...req.body, slug });
  res.status(201).json(new ApiResponse(201, product, "Produit créé."));
});

exports.update = catchAsync(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) throw new ApiError(404, "Produit introuvable.");
  if (req.body.name) req.body.slug = slugify(req.body.name, { lower: true, strict: true });
  await product.update(req.body);
  res.json(new ApiResponse(200, product, "Produit mis à jour."));
});

exports.uploadImages = catchAsync(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) throw new ApiError(404, "Produit introuvable.");
  const urls = req.files.map((f) => f.path);
  const images = [...(product.images || []), ...urls];
  await product.update({ images });
  res.json(new ApiResponse(200, { images }, "Images uploadées."));
});

exports.remove = catchAsync(async (req, res) => {
  const product = await Product.findByPk(req.params.id);
  if (!product) throw new ApiError(404, "Produit introuvable.");
  await product.update({ status: "archived" });
  res.json(new ApiResponse(200, null, "Produit archivé."));
});
