const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

//  CORS dynamique
const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS non autorisé : ' + origin));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//  Servir les images uploadées (dev local uniquement)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  Route santé (test que l'API répond)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'DJASSA API opérationnelle ', env: process.env.NODE_ENV });
});

//  Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const categoryRoutes = require('./routes/categoryRoutes');

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);

//  Route 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

//  Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
  console.error(' Erreur serveur:', err.message);
  res.status(500).json({ message: err.message || 'Erreur serveur interne' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Serveur DJASSA démarré sur le port ${PORT} [${process.env.NODE_ENV}]`);
});