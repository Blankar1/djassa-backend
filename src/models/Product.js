const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("Product", {
    id:           { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    name:         { type: DataTypes.STRING, allowNull: false },
    slug:         { type: DataTypes.STRING, unique: true },
    description:  { type: DataTypes.TEXT },
    shortDesc:    { type: DataTypes.STRING(500) },
    price:        { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    comparePrice: { type: DataTypes.DECIMAL(10, 2) },
    stock:        { type: DataTypes.INTEGER, defaultValue: 0 },
    images:       { type: DataTypes.ARRAY(DataTypes.STRING), defaultValue: [] },
    sku:          { type: DataTypes.STRING, unique: true },
    status:       { type: DataTypes.ENUM("active", "draft", "archived"), defaultValue: "draft" },
    avgRating:    { type: DataTypes.DECIMAL(3, 2), defaultValue: 0 },
    reviewCount:  { type: DataTypes.INTEGER, defaultValue: 0 },
    isFeatured:   { type: DataTypes.BOOLEAN, defaultValue: false },
    categoryId:   { type: DataTypes.UUID },
    specs:        { type: DataTypes.JSONB, defaultValue: {} },
  }, { tableName: "products", timestamps: true });
