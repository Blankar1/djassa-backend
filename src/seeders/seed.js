require("dotenv").config();
const { sequelize, Category, Product } = require("../models");
const slugify = require("slugify");

const categories = [
  { name: "Électronique",     order: 0, image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200&q=80" },
  { name: "Mode & Vêtements", order: 1, image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&q=80" },
  { name: "Maison & Cuisine", order: 2, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80" },
  { name: "Beauté & Santé",   order: 3, image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80" },
  { name: "Alimentation",     order: 4, image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=80" },
  { name: "Sport & Loisirs",  order: 5, image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200&q=80" },
];

const products = [
  {
    name: "Smartphone Tecno Spark 20",
    shortDesc: "6.6 pouces, 8Go RAM, 128Go, double SIM",
    description: "Le Tecno Spark 20 offre une expérience moderne à prix accessible. Écran 6.6 pouces FHD+, processeur Helio G85, batterie 5000mAh et appareil photo 50MP.",
    price: 85000, comparePrice: 95000, stock: 15, status: "active", isFeatured: true,
    images: ["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80","https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80"],
    categoryName: "Électronique",
    specs: { "Écran": "6.6 pouces", "RAM": "8 Go", "Stockage": "128 Go", "Batterie": "5000 mAh" },
  },
  {
    name: "Écouteurs Bluetooth TWS Pro",
    shortDesc: "Autonomie 24h, réduction de bruit, waterproof IPX5",
    description: "Écouteurs sans fil avec suppression active du bruit. Autonomie totale 24h, résistance IPX5.",
    price: 12500, comparePrice: 18000, stock: 40, status: "active", isFeatured: true,
    images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80"],
    categoryName: "Électronique",
    specs: { "Bluetooth": "5.3", "Autonomie": "24h", "Résistance": "IPX5" },
  },
  {
    name: "Robe Wax Kente Premium",
    shortDesc: "Tissu wax authentique, tailles S à XL",
    description: "Magnifique robe en tissu wax Kente fait main. Coupe moderne et élégante.",
    price: 22000, stock: 20, status: "active", isFeatured: true,
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b4d7d?w=600&q=80"],
    categoryName: "Mode & Vêtements",
    specs: { "Tissu": "Wax 100%", "Tailles": "S, M, L, XL" },
  },
  {
    name: "Ventilateur de Table 40cm",
    shortDesc: "3 vitesses, oscillation 80°, ultra-silencieux",
    description: "Ventilateur idéal pour le climat ivoirien. 3 vitesses, oscillation automatique 80°.",
    price: 18500, comparePrice: 22000, stock: 25, status: "active",
    images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"],
    categoryName: "Maison & Cuisine",
    specs: { "Diamètre": "40 cm", "Puissance": "45W" },
  },
  {
    name: "Set Casseroles Inox 5 Pièces",
    shortDesc: "Inox alimentaire, fond épais, compatible gaz",
    description: "Lot de 5 casseroles en inox alimentaire qualité professionnelle.",
    price: 28000, stock: 18, status: "active", isFeatured: true,
    images: ["https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600&q=80"],
    categoryName: "Maison & Cuisine",
    specs: { "Matière": "Inox 18/10", "Pièces": "5" },
  },
  {
    name: "Crème Karité Naturelle 250ml",
    shortDesc: "Beurre de karité pur, sans mercure, sans hydroquinone",
    description: "Crème à base de beurre de karité 100% naturel et extraits de plantes africaines.",
    price: 8500, stock: 60, status: "active",
    images: ["https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600&q=80"],
    categoryName: "Beauté & Santé",
    specs: { "Volume": "250 ml", "Type peau": "Toutes peaux" },
  },
  {
    name: "Huile de Coco Vierge Bio 500ml",
    shortDesc: "Pressée à froid, multi-usages : peau, cheveux, cuisine",
    description: "Huile de coco vierge extra bio, pressée à froid pour conserver tous les nutriments.",
    price: 6500, comparePrice: 8000, stock: 80, status: "active",
    images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80"],
    categoryName: "Beauté & Santé",
    specs: { "Volume": "500 ml", "Type": "Vierge extra bio" },
  },
  {
    name: "Attiéké Frais Premium 1kg",
    shortDesc: "Artisanal de Jacqueville, livraison fraîche Abidjan",
    description: "Attiéké frais de qualité supérieure, produit artisanalement à Jacqueville.",
    price: 2500, stock: 50, status: "active",
    images: ["https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&q=80"],
    categoryName: "Alimentation",
    specs: { "Poids": "1 kg", "Origine": "Jacqueville" },
  },
  {
    name: "Ballon de Foot Nike Strike T5",
    shortDesc: "Ballon officiel, cousu machine, toutes surfaces",
    description: "Ballon de football Nike Strike Taille 5. Chambre en butyle pour excellente rétention de l'air.",
    price: 15000, comparePrice: 18500, stock: 30, status: "active",
    images: ["https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=600&q=80"],
    categoryName: "Sport & Loisirs",
    specs: { "Taille": "5", "Matière": "Polyuréthane" },
  },
  {
    name: "Chaussures Running Sport",
    shortDesc: "Semelle amortissante, respirant, tailles 38 à 46",
    description: "Chaussures légères et respirantes parfaites pour la course et le sport quotidien.",
    price: 32000, comparePrice: 40000, stock: 22, status: "active", isFeatured: true,
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80"],
    categoryName: "Sport & Loisirs",
    specs: { "Tailles": "38 à 46", "Semelle": "EVA amortissante" },
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion PostgreSQL OK");
    await sequelize.sync({ alter: true });
    console.log("✅ Tables synchronisées");

    console.log("\n🔄 Réinitialisation...");
    await Product.destroy({ where: {}, truncate: true, cascade: true });
    await Category.destroy({ where: {}, truncate: true, cascade: true });
    console.log("   Anciennes données supprimées");

    const createdCats = {};
    for (const cat of categories) {
      const slug = slugify(cat.name, { lower: true, strict: true });
      const created = await Category.create({
        name: cat.name, slug, image: cat.image, isActive: true, order: cat.order,
      });
      createdCats[cat.name] = created.id;
      console.log(`  📁 ${cat.name}`);
    }

    for (const p of products) {
      const slug = slugify(p.name, { lower: true, strict: true });
      await Product.create({
        name: p.name, slug, description: p.description, shortDesc: p.shortDesc,
        price: p.price, comparePrice: p.comparePrice || null, stock: p.stock,
        images: p.images, status: p.status, isFeatured: p.isFeatured || false,
        categoryId: createdCats[p.categoryName], specs: p.specs || {},
      });
      console.log(`  📦 ${p.name} (${p.images.length} image(s))`);
    }

    console.log("\n🎉 Seed terminé !");
    console.log(`   ✅ ${categories.length} catégories`);
    console.log(`   ✅ ${products.length} produits avec images réelles`);
    console.log("\n🌐 Ouvre http://localhost:5173 pour voir le résultat !");
    process.exit(0);
  } catch (err) {
    console.error("❌ Erreur:", err.message);
    console.error(err);
    process.exit(1);
  }
}

seed();