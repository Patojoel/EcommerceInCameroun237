# 📋 CHANGELOG

Toutes les modifications notables du projet sont documentées ici.
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Versionnage selon [Semantic Versioning](https://semver.org/lang/fr/).

---

## [Unreleased]

### En cours
- Déploiement production

---

## [0.1.0] — 2025-04-02

### Ajouté
- Setup complet Next.js 14 avec App Router
- Authentification NextAuth (credentials + Google OAuth)
- Schéma Prisma complet (User, Product, Category, Order, OrderItem)
- Composants UI shadcn/ui (Button, Input, Card, Badge, Dialog, Toast, etc.)
- Page d'accueil avec hero, catégories et produits en vedette
- Catalogue produits avec filtres (catégorie, prix, stock, recherche)
- Page fiche produit avec galerie d'images et bouton d'ajout au panier
- Panier persistant via Zustand + localStorage (CartDrawer)
- Pages catégories avec grille de produits
- Authentification : Login, Inscription, Mot de passe oublié
- Espace client : Compte, Commandes, Profil
- Checkout avec formulaire d'adresse et Stripe
- Panel administration complet (Dashboard, Produits CRUD, Commandes, Clients)
- API Routes : /api/products, /api/orders, /api/checkout, /api/webhook/stripe
- Upload d'images via Cloudinary
- Emails transactionnels via Resend
- Sitemap dynamique et robots.txt
- Middleware de protection des routes (admin, account, checkout)
- Headers de sécurité HTTP
- SEO : generateMetadata par page, OpenGraph, Twitter cards
- Données de test (seed) avec produits camerounais authentiques

---

## [1.0.0] — À venir
### Ajouté
- Catalogue produits
- Système panier
- Paiement Stripe
- Authentification utilisateur
- Panel administrateur
- Déploiement Vercel

---

<!--
## [0.2.0] — YYYY-MM-DD
### Ajouté
- Nouvelle fonctionnalité X

### Modifié
- Comportement de Y

### Corrigé
- Bug sur Z

### Supprimé
- Fonctionnalité dépréciée W
-->

---

## Guide de versionnage

| Version | Signification |
|---------|--------------|
| `1.0.0` | Première version stable |
| `1.1.0` | Nouvelle fonctionnalité (rétrocompatible) |
| `1.0.1` | Correction de bug (rétrocompatible) |
| `2.0.0` | Breaking change |