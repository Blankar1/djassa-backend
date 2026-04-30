const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("Category", {
    id:          { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    name:        { type: DataTypes.STRING, allowNull: false },
    slug:        { type: DataTypes.STRING, unique: true },
    description: { type: DataTypes.TEXT },
    image:       { type: DataTypes.STRING },
    isActive:    { type: DataTypes.BOOLEAN, defaultValue: true },
    order:       { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: "categories", timestamps: true });
