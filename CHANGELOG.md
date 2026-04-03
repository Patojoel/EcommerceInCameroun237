# 📋 CHANGELOG

Toutes les modifications notables du projet sont documentées ici.
Format basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/).
Versionnage selon [Semantic Versioning](https://semver.org/lang/fr/).

---

## [Unreleased]

### En cours
- Configuration production (BDD, Stripe live, domaine)

---

## [0.2.0] — 2026-04-03

### Ajouté — Phase 7 : Déploiement Production
- Pipeline CI/CD GitHub Actions (`.github/workflows/ci.yml`)
  - Jobs : Lint, TypeScript type-check, Build, Prisma validate
- Workflow de déploiement automatique Vercel (`.github/workflows/deploy.yml`)
  - Health checks post-déploiement (homepage, API, sitemap, robots.txt)
- Script de vérification pré-déploiement (`scripts/pre-deploy-check.sh`)
  - Vérification fichiers essentiels, .gitignore, env, Prisma, TS, ESLint, sécurité, build, audit npm
- Intégration Vercel Analytics + Speed Insights
- Documentation API complète (`docs/API_REFERENCE.md`) — tous les endpoints documentés
- Politique de sécurité (`docs/SECURITY.md`) — mesures en place, checklist, bonnes pratiques
- Fichier CODEOWNERS (`.github/CODEOWNERS`)
- Scripts npm : `type-check`, `pre-deploy`

### Modifié
- `app/layout.tsx` — Ajout composants `<Analytics />` et `<SpeedInsights />`
- `package.json` — Ajout dépendances `@vercel/analytics`, `@vercel/speed-insights`
- `ROADMAP.md` — Phase 7 restructurée avec sous-sections détaillées
- `docs/STRUCTURE.md` — Mise à jour avec nouveaux fichiers et dossiers

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