# 📡 RÉFÉRENCE API

Documentation complète des endpoints API du projet EcommerceInCameroun237.

**URL de base** : `https://votredomaine.com/api`

---

## Table des matières

1. [Authentification](#1-authentification)
2. [Produits](#2-produits)
3. [Commandes](#3-commandes)
4. [Checkout](#4-checkout)
5. [Upload](#5-upload)
6. [Webhook Stripe](#6-webhook-stripe)
7. [Codes d'erreur](#7-codes-derreur)

---

## 1. Authentification

### `POST /api/auth/register` — Créer un compte

**Accès** : Public

**Body** :
```json
{
  "name": "Jean Dupont",
  "email": "jean@example.com",
  "password": "motdepasse123"
}
```

**Validation** :
| Champ | Règles |
|-------|--------|
| `name` | String, min 2 caractères |
| `email` | String, format email valide |
| `password` | String, min 8 caractères |

**Réponses** :

| Code | Description |
|------|-------------|
| `201` | Compte créé avec succès |
| `400` | Données invalides (erreur Zod) |
| `409` | Email déjà utilisé |
| `500` | Erreur serveur |

**Exemple 201** :
```json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "jean@example.com",
    "name": "Jean Dupont",
    "role": "CUSTOMER",
    "createdAt": "2025-04-02T..."
  }
}
```

### `POST /api/auth/[...nextauth]` — Connexion / Session

Géré automatiquement par **NextAuth.js**. Voir la [documentation NextAuth](https://next-auth.js.org/getting-started/rest-api).

Providers configurés : `Credentials`, `Google OAuth`

---

## 2. Produits

### `GET /api/products` — Liste des produits

**Accès** : Public

**Query Params** :

| Param | Type | Défaut | Description |
|-------|------|--------|-------------|
| `page` | number | `1` | Numéro de page |
| `limit` | number | `12` | Produits par page |
| `category` | string | — | Slug de la catégorie |
| `search` | string | — | Recherche dans nom et description |
| `minPrice` | number | — | Prix minimum |
| `maxPrice` | number | — | Prix maximum |
| `inStock` | `"true"` | — | Uniquement les produits en stock |
| `featured` | `"true"` | — | Uniquement les produits en vedette |
| `sortBy` | string | — | Tri : `price_asc`, `price_desc`, `name_asc` |

**Exemple** : `GET /api/products?category=vetements&minPrice=5000&page=1&limit=6`

**Réponse 200** :
```json
{
  "products": [
    {
      "id": "clx...",
      "name": "T-shirt Wax",
      "slug": "t-shirt-wax",
      "description": "...",
      "price": 15000,
      "stock": 25,
      "images": ["https://res.cloudinary.com/..."],
      "featured": true,
      "categoryId": "clx...",
      "category": { "id": "...", "name": "Vêtements", "slug": "vetements" },
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 6,
  "totalPages": 7
}
```

### `POST /api/products` — Créer un produit

**Accès** : 🔒 ADMIN uniquement

**Body** :
```json
{
  "name": "T-shirt Wax",
  "slug": "t-shirt-wax",
  "description": "Description d'au moins 10 caractères",
  "price": 15000,
  "stock": 25,
  "images": ["https://res.cloudinary.com/..."],
  "featured": false,
  "categoryId": "clx..."
}
```

**Réponses** :

| Code | Description |
|------|-------------|
| `201` | Produit créé |
| `400` | Données invalides |
| `403` | Non autorisé (pas ADMIN) |
| `409` | Slug déjà existant |
| `500` | Erreur serveur |

### `GET /api/products/[id]` — Détail d'un produit

**Accès** : Public

Accepte un `id` (cuid) ou un `slug` comme paramètre.

**Réponse 200** : Objet produit avec catégorie incluse.

**Réponse 404** :
```json
{ "error": "Produit introuvable" }
```

### `PUT /api/products/[id]` — Modifier un produit

**Accès** : 🔒 ADMIN uniquement

**Body** : Champs partiels du produit à mettre à jour.

### `DELETE /api/products/[id]` — Supprimer un produit

**Accès** : 🔒 ADMIN uniquement

**Réponse 200** :
```json
{ "success": true }
```

---

## 3. Commandes

### `GET /api/orders` — Liste des commandes

**Accès** : 🔒 Authentifié

- **ADMIN** : retourne toutes les commandes
- **CUSTOMER** : retourne uniquement ses propres commandes

**Réponse 200** : Tableau de commandes avec items et informations utilisateur.

### `POST /api/orders` — Créer une commande

**Accès** : 🔒 Authentifié

**Body** :
```json
{
  "items": [
    {
      "productId": "clx...",
      "quantity": 2,
      "price": 15000
    }
  ],
  "shippingAddress": {
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+237 6XX XXX XXX",
    "address": "123 Rue principale",
    "city": "Douala",
    "postalCode": "000",
    "country": "CM"
  },
  "total": 30000
}
```

**Réponses** :

| Code | Description |
|------|-------------|
| `201` | Commande créée |
| `400` | Données invalides |
| `401` | Non authentifié |
| `500` | Erreur serveur |

### `GET /api/orders/[id]` — Détail d'une commande

**Accès** : 🔒 Authentifié (propriétaire ou ADMIN)

### `PATCH /api/orders/[id]` — Changer le statut

**Accès** : 🔒 ADMIN uniquement

**Body** :
```json
{ "status": "SHIPPED" }
```

Statuts valides : `PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`

---

## 4. Checkout

### `POST /api/checkout` — Créer une session de paiement Stripe

**Accès** : 🔒 Authentifié

**Body** :
```json
{
  "items": [
    {
      "productId": "clx...",
      "name": "T-shirt Wax",
      "price": 15000,
      "quantity": 2,
      "image": "https://res.cloudinary.com/..."
    }
  ],
  "shippingAddress": {
    "name": "Jean Dupont",
    "email": "jean@example.com",
    "phone": "+237 6XX XXX XXX",
    "address": "123 Rue principale",
    "city": "Douala",
    "postalCode": "000",
    "country": "CM"
  }
}
```

**Réponse 200** :
```json
{ "url": "https://checkout.stripe.com/c/pay/cs_live_..." }
```

> Le client est redirigé vers cette URL pour compléter le paiement.

**Flux** :
```
Client → POST /api/checkout → Commande créée (PENDING)
  → Stripe Checkout Session → Redirect vers Stripe
    → Paiement réussi → Webhook → Statut → PAID
    → Paiement échoué → Webhook → Statut → CANCELLED
```

---

## 5. Upload

### `POST /api/upload` — Upload d'image

**Accès** : 🔒 ADMIN uniquement

**Content-Type** : `multipart/form-data`

**Body** : `file` — Fichier image (JPEG, PNG, WebP)

**Réponse 200** :
```json
{ "url": "https://res.cloudinary.com/xxx/image/upload/v.../ecommerce237/products/abc.jpg" }
```

---

## 6. Webhook Stripe

### `POST /api/webhook/stripe` — Webhook de paiement

**Accès** : Stripe uniquement (vérifié par signature)

**Événements gérés** :

| Événement | Action |
|-----------|--------|
| `checkout.session.completed` | Passe la commande en `PAID`, décrémente le stock, envoie l'email de confirmation |
| `payment_intent.payment_failed` | Passe la commande en `CANCELLED` |

> ⚠️ Ce endpoint ne doit JAMAIS être appelé manuellement. Il est exclusivement réservé à Stripe.

---

## 7. Codes d'erreur

### Format standard des erreurs

```json
{
  "error": "Message d'erreur lisible",
  "details": []  // Optionnel : détails Zod
}
```

### Table des codes

| Code | Signification |
|------|--------------|
| `200` | Succès |
| `201` | Ressource créée |
| `400` | Données invalides / requête malformée |
| `401` | Non authentifié |
| `403` | Non autorisé (permissions insuffisantes) |
| `404` | Ressource introuvable |
| `409` | Conflit (doublon email, slug, etc.) |
| `500` | Erreur serveur interne |

---

## Notes techniques

- **Devise** : Les prix sont en **XAF** (Franc CFA). Stripe les reçoit en sous-unités.
- **Pagination** : Par défaut, 12 éléments par page.
- **Tri** : Par date de création décroissante par défaut.
- **Validation** : Tous les inputs sont validés avec **Zod** côté serveur.
- **Authentification** : Sessions gérées par **NextAuth.js** avec tokens JWT.
