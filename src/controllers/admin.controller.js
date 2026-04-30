const { Order, Product, User, OrderItem } = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

exports.getDashboard = catchAsync(async (req, res) => {
  const today = new Date(); today.setHours(0,0,0,0);
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const [totalRevenue, monthRevenue, todayOrders, totalOrders, totalClients, lowStock] = await Promise.all([
    Order.sum("total", { where: { paymentStatus: "paid" } }),
    Order.sum("total", { where: { paymentStatus: "paid", createdAt: { [Op.gte]: monthStart } } }),
    Order.count({ where: { createdAt: { [Op.gte]: today } } }),
    Order.count(),
    User.count({ where: { role: "customer" } }),
    Product.findAll({ where: { stock: { [Op.lte]: 5 }, status: "active" }, attributes: ["id","name","stock"], limit: 10 }),
  ]);

  res.json(new ApiResponse(200, {
    stats: { totalRevenue, monthRevenue, todayOrders, totalOrders, totalClients },
    alerts: { lowStock },
  }));
});
