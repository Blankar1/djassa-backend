# Configuration Cloudinary pour DJASSA

## Étape 1 — Créer un compte gratuit

1. Va sur https://cloudinary.com/
2. Clique "Sign Up for Free"
3. Remplis nom, email, mot de passe
4. Confirme ton email

## Étape 2 — Récupérer tes clés API

1. Connecte-toi sur https://console.cloudinary.com/
2. Clique sur l'icône en haut à droite → "Settings" OU
   Copie directement depuis le Dashboard Home :
   - Cloud Name  → CLOUDINARY_CLOUD_NAME
   - API Key     → CLOUDINARY_API_KEY
   - API Secret  → CLOUDINARY_API_SECRET

## Étape 3 — Mettre à jour ton .env

```env
CLOUDINARY_CLOUD_NAME=ton_cloud_name_ici
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz
```

## Étape 4 — Créer un dossier "djassa" dans Cloudinary

1. Va sur https://console.cloudinary.com/console/media_library
2. Clique "New Folder" → nomme-le "djassa"
3. À l'intérieur, crée un sous-dossier "products"

## Étape 5 — Tester l'upload

Redémarre le serveur backend (`npm run dev`), puis dans l'admin DJASSA :
1. Va sur http://localhost:5173/admin/produits
2. Clique "Modifier" sur un produit existant
3. Clique la zone d'upload et sélectionne une image
4. L'image doit apparaître dans ton dashboard Cloudinary

## Compte gratuit Cloudinary — Limites

| Ressource       | Limite gratuite     |
|-----------------|---------------------|
| Stockage        | 25 Go               |
| Bande passante  | 25 Go/mois          |
| Transformations | 25 crédits/mois     |
| Images          | Illimité            |

**Largement suffisant pour démarrer DJASSA !**

## Optimisations automatiques configurées

Dans `src/config/cloudinary.js`, les images sont automatiquement :
- Redimensionnées à max 800x800px
- Compressées en qualité "auto" (Cloudinary optimise)
- Limitées à 5 Mo par image
- Converties au format optimal (WebP si supporté)
