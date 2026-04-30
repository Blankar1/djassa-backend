const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("Address", {
    id:            { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    userId:        { type: DataTypes.UUID, allowNull: false },
    label:         { type: DataTypes.STRING, defaultValue: "Domicile" },
    recipientName: { type: DataTypes.STRING },
    phone:         { type: DataTypes.STRING },
    commune:       { type: DataTypes.STRING },
    quartier:      { type: DataTypes.STRING },
    details:       { type: DataTypes.TEXT },
    isDefault:     { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: "addresses", timestamps: true });
