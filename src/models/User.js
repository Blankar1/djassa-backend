const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) =>
  sequelize.define("User", {
    id:       { type: DataTypes.UUID, defaultValue: () => uuidv4(), primaryKey: true },
    name:     { type: DataTypes.STRING, allowNull: false },
    email:    { type: DataTypes.STRING, unique: true, allowNull: false, validate: { isEmail: true } },
    password: { type: DataTypes.STRING },
    phone:    { type: DataTypes.STRING },
    role:     { type: DataTypes.ENUM("customer", "admin"), defaultValue: "customer" },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    resetPasswordToken:   { type: DataTypes.STRING },
    resetPasswordExpires: { type: DataTypes.DATE },
  }, { tableName: "users", timestamps: true });
