const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("Order", {
    id:            { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    orderNumber:   { type: DataTypes.STRING, unique: true },
    userId:        { type: DataTypes.UUID },
    guestEmail:    { type: DataTypes.STRING },
    guestName:     { type: DataTypes.STRING },
    guestPhone:    { type: DataTypes.STRING },
    status:        {
      type: DataTypes.ENUM("pending","confirmed","processing","shipped","delivered","cancelled"),
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending","paid","failed","refunded"),
      defaultValue: "pending",
    },
    paymentMethod: {
      type: DataTypes.ENUM("orange_money","wave","mtn","cash_on_delivery"),
      defaultValue: "cash_on_delivery",
    },
    subtotal:    { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    deliveryFee: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    discount:    { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    total:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    promoId:     { type: DataTypes.UUID },
    notes:       { type: DataTypes.TEXT },
    commune:     { type: DataTypes.STRING },
    quartier:    { type: DataTypes.STRING },
    addressDetails: { type: DataTypes.TEXT },
  }, { tableName: "orders", timestamps: true });
