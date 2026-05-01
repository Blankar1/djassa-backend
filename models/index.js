const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: process.env.NODE_ENV === 'production'
      ? { require: true, rejectUnauthorized: false }
      : false,
  },
});

const User     = require('./User')(sequelize);
const Category = require('./Category')(sequelize);
const Product  = require('./Product')(sequelize);
const Order    = require('./Order')(sequelize);
const OrderItem = require('./OrderItem')(sequelize);

// ─── RELATIONS ────────────────────────────────────────
Product.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Product,   { foreignKey: 'categoryId', as: 'products' });

Order.belongsTo(User,       { foreignKey: 'userId', as: 'user' });
User.hasMany(Order,         { foreignKey: 'userId', as: 'orders' });

Order.hasMany(OrderItem,    { foreignKey: 'orderId', as: 'items' });
OrderItem.belongsTo(Order,  { foreignKey: 'orderId' });

OrderItem.belongsTo(Product, { foreignKey: 'productId', as: 'product' });
Product.hasMany(OrderItem,   { foreignKey: 'productId' });

// ─── SYNC ─────────────────────────────────────────────
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connexion PostgreSQL réussie');
    await sequelize.sync({ alter: true });
    console.log('✅ Tables synchronisées');
  } catch (error) {
    console.error('❌ Erreur DB:', error.message);
    process.exit(1);
  }
};

syncDatabase();

module.exports = { sequelize, User, Category, Product, Order, OrderItem };