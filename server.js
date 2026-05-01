const app = require('./src/app');
const { sequelize } = require('./src/models');
const PORT = process.env.PORT || 5000;

sequelize.authenticate()
  .then(() => {
    console.log("✅ PostgreSQL connecté");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Serveur DJASSA démarré sur http://localhost:${PORT}`);
      console.log(`📁 Images servies sur http://localhost:${PORT}/uploads/products/`);
    });
  })
  .catch((err) => {
    console.error("❌ Erreur démarrage:", err.message);
    process.exit(1);
  });