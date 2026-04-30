const { Product, Category } = require('../models');

// @desc    Créer un produit
// @route   POST /api/products
// @access  Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, categoryId } = req.body;

    //  URL image : Cloudinary en prod, chemin local en dev
    let imageUrl = null;
    if (req.file) {
      // Cloudinary retourne req.file.path
      // Multer local retourne req.file.filename
      imageUrl = req.file.path || `/uploads/${req.file.filename}`;
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock),
      image: imageUrl,
      categoryId: categoryId || null,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Erreur createProduct:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour un produit
// @route   PUT /api/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });

    const { name, description, price, stock, categoryId } = req.body;

    let imageUrl = product.image; // garde l'ancienne image par défaut
    if (req.file) {
      imageUrl = req.file.path || `/uploads/${req.file.filename}`;
    }

    await product.update({
      name: name || product.name,
      description: description || product.description,
      price: price ? parseFloat(price) : product.price,
      stock: stock ? parseInt(stock) : product.stock,
      image: imageUrl,
      categoryId: categoryId || product.categoryId,
    });

    res.json(product);
  } catch (error) {
    console.error('Erreur updateProduct:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir tous les produits
// @route   GET /api/products
const getProducts = async (req, res) => {
  try {
    const { search, categoryId } = req.query;
    const where = {};

    if (search) {
      const { Op } = require('sequelize');
      where.name = { [Op.iLike]: `%${search}%` };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const products = await Product.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir un produit par ID
// @route   GET /api/products/:id
const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
    });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Supprimer un produit
// @route   DELETE /api/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    await product.destroy();
    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
