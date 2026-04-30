const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("OrderItem", {
    id:          { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    orderId:     { type: DataTypes.UUID, allowNull: false },
    productId:   { type: DataTypes.UUID },
    productName: { type: DataTypes.STRING, allowNull: false },
    productImage:{ type: DataTypes.STRING },
    price:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    quantity:    { type: DataTypes.INTEGER, allowNull: false },
    subtotal:    { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  }, { tableName: "order_items", timestamps: false });
