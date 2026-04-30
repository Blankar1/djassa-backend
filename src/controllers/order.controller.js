const { Order, OrderItem, Product, Promo } = require("../models");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");
const { getPagination, getPagingData } = require("../utils/pagination");
const emailService = require("../services/email.service");

const generateOrderNumber = () => {
  const date = new Date().toISOString().slice(0,10).replace(/-/g,"");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `DJASSA-${date}-${rand}`;
};

exports.createOrder = catchAsync(async (req, res) => {
  const { items, paymentMethod, commune, quartier, addressDetails,
          notes, guestName, guestEmail, guestPhone, promoCode } = req.body;

  if (!items || items.length === 0) throw new ApiError(400, "Le panier est vide.");

  // Valider les produits et calculer les montants
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findByPk(item.productId);
    if (!product || product.status !== "active") throw new ApiError(400, `Produit indisponible.`);
    if (product.stock < item.quantity) throw new ApiError(400, `Stock insuffisant pour "${product.name}".`);
    const lineTotal = parseFloat(product.price) * item.quantity;
    subtotal += lineTotal;
    orderItems.push({
      productId: product.id,
      productName: product.name,
      productImage: product.images?.[0] || null,
      price: product.price,
      quantity: item.quantity,
      subtotal: lineTotal,
    });
  }

  // Livraison
  const deliveryFees = { "Plateau": 500, "Cocody": 1000, "Yopougon": 1500,
    "Abobo": 1500, "Adjamé": 1000, "Treichville": 800, "Marcory": 1000,
    "Koumassi": 1200, "Port-Bouet": 2000, "Autres": 2000 };
  const deliveryFee = deliveryFees[commune] ?? 2000;

  // Promo
  let discount = 0;
  let promoId  = null;
  if (promoCode) {
    const promo = await Promo.findOne({ where: { code: promoCode, isActive: true } });
    if (promo && subtotal >= promo.minOrder) {
      if (!promo.maxUses || promo.usedCount < promo.maxUses) {
        discount = promo.type === "percentage"
          ? (subtotal * promo.value) / 100
          : promo.value;
        promoId = promo.id;
        await promo.increment("usedCount");
      }
    }
  }

  const total = subtotal + deliveryFee - discount;
  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    userId: req.user?.id || null,
    guestName, guestEmail, guestPhone,
    paymentMethod, commune, quartier, addressDetails, notes,
    subtotal, deliveryFee, discount, total, promoId,
  });

  // Créer les lignes et décrémenter le stock
  for (const item of orderItems) {
    await OrderItem.create({ ...item, orderId: order.id });
    await Product.decrement("stock", { by: item.quantity, where: { id: item.productId } });
  }

  // Email de confirmation
  const email = guestEmail || req.user?.email;
  if (email) await emailService.sendOrderConfirmation(email, order);

  res.status(201).json(new ApiResponse(201, order, "Commande créée avec succès."));
});

exports.getMyOrders = catchAsync(async (req, res) => {
  const orders = await Order.findAll({
    where: { userId: req.user.id },
    include: [{ model: OrderItem, as: "items" }],
    order: [["createdAt", "DESC"]],
  });
  res.json(new ApiResponse(200, orders));
});

exports.getOne = catchAsync(async (req, res) => {
  const order = await Order.findByPk(req.params.id, {
    include: [{ model: OrderItem, as: "items" }],
  });
  if (!order) throw new ApiError(404, "Commande introuvable.");
  res.json(new ApiResponse(200, order));
});

exports.getAllAdmin = catchAsync(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const data = await Order.findAndCountAll({
    include: [{ model: OrderItem, as: "items" }],
    order: [["createdAt", "DESC"]],
    limit, offset,
  });
  res.json(new ApiResponse(200, getPagingData(data, page, limit)));
});

exports.updateStatus = catchAsync(async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) throw new ApiError(404, "Commande introuvable.");
  const { status, paymentStatus } = req.body;
  if (status)        order.status        = status;
  if (paymentStatus) order.paymentStatus = paymentStatus;
  await order.save();
  res.json(new ApiResponse(200, order, "Statut mis à jour."));
});
