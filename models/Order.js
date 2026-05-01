const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Order = sequelize.define('Order', {
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'delivered', 'cancelled'),
      defaultValue: 'pending',
    },
    userId: {
      type: DataTypes.INTEGER,
    },
  }, { tableName: 'orders' });

  return Order;
};