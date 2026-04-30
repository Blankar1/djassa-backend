const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("Promo", {
    id:           { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    code:         { type: DataTypes.STRING, unique: true, allowNull: false },
    type:         { type: DataTypes.ENUM("percentage", "fixed"), allowNull: false },
    value:        { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    minOrder:     { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    maxUses:      { type: DataTypes.INTEGER },
    usedCount:    { type: DataTypes.INTEGER, defaultValue: 0 },
    isActive:     { type: DataTypes.BOOLEAN, defaultValue: true },
    expiresAt:    { type: DataTypes.DATE },
  }, { tableName: "promos", timestamps: true });
