const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("Review", {
    id:        { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    userId:    { type: DataTypes.UUID, allowNull: false },
    productId: { type: DataTypes.UUID, allowNull: false },
    rating:    { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
    title:     { type: DataTypes.STRING },
    comment:   { type: DataTypes.TEXT },
    isApproved:{ type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: "reviews", timestamps: true });
