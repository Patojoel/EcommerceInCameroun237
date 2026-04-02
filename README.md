# 🛒 [ECOMMERCEINCAMEROUN237] — E-commerce Next.js

> Courte description du projet (ex: Boutique en ligne de vêtements artisanaux camerounais)

[![Vercel Deploy](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📌 Table des matières

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Démarrage rapide](#démarrage-rapide)
- [Variables d&#39;environnement](#variables-denvironnement)
- [Structure du projet](#structure-du-projet)
- [Déploiement](#déploiement)
- [Contribuer](#contribuer)

---

## Aperçu

[Décris ici le produit, ses fonctionnalités clés et sa cible utilisateur]

**Fonctionnalités principales :**

- 🛍️ Catalogue produits avec filtres et recherche
- 🛒 Panier persistant (localStorage / session)
- 💳 Paiement sécurisé (Stripe / PayDunya / etc.)
- 👤 Authentification utilisateur
- 📦 Suivi des commandes
- 🔧 Panel d'administration

---

## Stack technique

| Couche           | Technologie                 |
| ---------------- | --------------------------- |
| Framework        | Next.js 14 (App Router)     |
| UI               | Tailwind CSS + shadcn/ui    |
| Base de données | PostgreSQL (via Prisma ORM) |
| Auth             | NextAuth.js                 |
| Paiement         | Stripe                      |
| Media            | Cloudinary                  |
| Déploiement     | Vercel                      |
| Email            | Resend / Nodemailer         |

---

## Démarrage rapide

```bash
# 1. Cloner le repo
git clone https://github.com/Patojoel/EcommerceInCameroun237.git
cd EcommerceInCameroun237

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Initialiser la base de données
npx prisma migrate dev --name init
npx prisma db seed

# 5. Lancer le serveur de développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

---

## Variables d'environnement

Voir le fichier [`.env.example`](.env.example) pour la liste complète.

Les variables **obligatoires** au démarrage :

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
STRIPE_SECRET_KEY
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
```

---

## Structure du projet

Voir [`STRUCTURE.md`](docs/STRUCTURE.md) pour le détail complet de l'arborescence.

---

## Déploiement

Voir le guide complet dans [`DEPLOYMENT.md`](docs/DEPLOYMENT.md).

---

## Contribuer

Voir [`CONTRIBUTING.md`](CONTRIBUTING.md) pour les conventions et le workflow Git.

---

## Licence

[MIT](LICENSE) — [NOM DU PROJET] © 2025
