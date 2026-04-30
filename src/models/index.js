const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User     = require("./User")(sequelize, DataTypes);
const Category = require("./Category")(sequelize, DataTypes);
const Product  = require("./Product")(sequelize, DataTypes);
const Address  = require("./Address")(sequelize, DataTypes);
const Order    = require("./Order")(sequelize, DataTypes);
const OrderItem= require("./OrderItem")(sequelize, DataTypes);
const Review   = require("./Review")(sequelize, DataTypes);
const Promo    = require("./Promo")(sequelize, DataTypes);

// Relations
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

User.hasMany(Order, { foreignKey: "userId", as: "orders" });
Order.belongsTo(User, { foreignKey: "userId", as: "user" });

User.hasMany(Address, { foreignKey: "userId", as: "addresses" });
Address.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Review, { foreignKey: "userId", as: "reviews" });
Review.belongsTo(User, { foreignKey: "userId", as: "user" });

Product.hasMany(Review, { foreignKey: "productId", as: "reviews" });
Review.belongsTo(Product, { foreignKey: "productId" });

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "items" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

Product.hasMany(OrderItem, { foreignKey: "productId" });
OrderItem.belongsTo(Product, { foreignKey: "productId", as: "product" });

Promo.hasMany(Order, { foreignKey: "promoId" });
Order.belongsTo(Promo, { foreignKey: "promoId", as: "promo" });

module.exports = { sequelize, User, Category, Product, Address, Order, OrderItem, Review, Promo };
