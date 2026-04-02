# 🗄️ SCHÉMA DE BASE DE DONNÉES

Documentation du modèle de données du projet.

---

## Diagramme de relations

```
User ──────────── Order ──────────── OrderItem
  │                                      │
  │                                   Product ──── Category
  │
  └── (via NextAuth) Account, Session

```

---

## Tables

### `User`
Compte utilisateur (clients + admins)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Identifiant unique |
| `email` | String unique | Email de connexion |
| `name` | String? | Nom affiché |
| `password` | String? | Hash bcrypt (null si OAuth) |
| `role` | Enum (CUSTOMER/ADMIN) | Permissions |
| `image` | String? | URL avatar |
| `createdAt` | DateTime | Date d'inscription |

---

### `Product`
Produit de la boutique

| Champ | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Identifiant unique |
| `name` | String | Nom du produit |
| `slug` | String unique | URL-friendly (ex: `t-shirt-blanc`) |
| `description` | String | Description longue |
| `price` | Float | Prix en XAF/EUR |
| `stock` | Int | Quantité disponible |
| `images` | String[] | URLs Cloudinary |
| `categoryId` | String | FK vers Category |
| `featured` | Boolean | Mis en avant sur home |
| `createdAt` | DateTime | Date de création |

---

### `Category`
Catégorie de produits

| Champ | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Identifiant unique |
| `name` | String | Nom de la catégorie |
| `slug` | String unique | URL-friendly |
| `image` | String? | Image représentative |

---

### `Order`
Commande passée par un client

| Champ | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Identifiant unique |
| `userId` | String | FK vers User |
| `total` | Float | Montant total |
| `status` | Enum | État de la commande |
| `stripeId` | String? | ID session Stripe |
| `shippingAddress` | Json | Adresse de livraison |
| `createdAt` | DateTime | Date de commande |

**Statuts de commande :**
```
PENDING → PAID → SHIPPED → DELIVERED
            └→ CANCELLED
```

---

### `OrderItem`
Ligne d'une commande (produit + quantité)

| Champ | Type | Description |
|-------|------|-------------|
| `id` | String (cuid) | Identifiant unique |
| `orderId` | String | FK vers Order |
| `productId` | String | FK vers Product |
| `quantity` | Int | Quantité commandée |
| `price` | Float | Prix au moment de la commande |

> ⚠️ Le `price` est dupliqué ici intentionnellement : si le prix du produit change, l'historique reste cohérent.

---

### Tables NextAuth (auto-générées)
`Account`, `Session`, `VerificationToken`
Ces tables sont gérées automatiquement par NextAuth.js — ne pas modifier manuellement.

---

## Commandes Prisma utiles

```bash
# Créer une migration après modification du schema
npx prisma migrate dev --name description-du-changement

# Appliquer les migrations en production
npx prisma migrate deploy

# Ouvrir l'interface graphique de la BDD
npx prisma studio

# Régénérer le client Prisma
npx prisma generate

# Remplir la BDD avec les données de test
npx prisma db seed

# Réinitialiser la BDD locale (⚠️ efface tout)
npx prisma migrate reset
```
