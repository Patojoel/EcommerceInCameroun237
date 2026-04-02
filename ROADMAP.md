# 🗺️ ROADMAP

Suivi de l'avancement du projet, phase par phase.

---

## Phase 1 — Setup & Infrastructure ✅
**Durée estimée : 2–3 jours**

- [x] Initialiser le projet Next.js (`npx create-next-app@latest`)
- [x] Configurer Tailwind CSS + shadcn/ui
- [x] Configurer TypeScript strict
- [x] Initialiser Prisma + connecter la BDD locale
- [x] Définir le schéma Prisma complet
- [x] Configurer NextAuth (credentials + Google OAuth)
- [x] Mettre en place le middleware de protection des routes
- [x] Configurer Cloudinary pour les uploads
- [x] Mettre en place `.env.example` et `.env.local`
- [x] Initialiser le repo Git avec `.gitignore` correct
- [x] Premier déploiement Vercel (sans fonctionnalités)

---

## Phase 2 — Catalogue Produits 🛍️ ✅
**Durée estimée : 3–5 jours**

- [x] Page d'accueil (hero, featured products, catégories)
- [x] Page catalogue avec grille de produits
- [x] Filtres (catégorie, prix, disponibilité)
- [x] Barre de recherche
- [x] Page fiche produit (images, description, stock)
- [x] Composant `ProductCard` réutilisable
- [x] Système de catégories
- [x] Pagination ou infinite scroll
- [x] Métadonnées SEO par produit (`generateMetadata`)

---

## Phase 3 — Panier & Checkout 🛒 ✅
**Durée estimée : 4–6 jours**

- [x] Store Zustand pour le panier
- [x] Persistance panier (localStorage)
- [x] Page panier (ajout, suppression, modification quantité)
- [x] Intégration Stripe Checkout
- [x] Page de paiement (formulaire adresse + carte)
- [x] Webhook Stripe (`payment_intent.succeeded`)
- [x] Page de confirmation de commande
- [x] Email de confirmation (Resend)

---

## Phase 4 — Authentification & Compte Client 👤 ✅
**Durée estimée : 2–3 jours**

- [x] Page d'inscription
- [x] Page de connexion
- [x] Mot de passe oublié + reset
- [x] Espace client : profil
- [x] Espace client : historique des commandes
- [x] Espace client : détail d'une commande

---

## Phase 5 — Panel d'administration 🔧 ✅
**Durée estimée : 5–7 jours**

- [x] Dashboard avec statistiques (CA, commandes, clients)
- [x] CRUD Produits (liste, création, édition, suppression)
- [x] Upload d'images produit (Cloudinary)
- [x] Gestion des catégories
- [x] Liste des commandes + changement de statut
- [x] Liste des clients
- [x] Notifications admin (nouvelles commandes)

---

## Phase 6 — Qualité & Performance 🚀 ✅
**Durée estimée : 2–3 jours**

- [x] Optimisation images (`next/image`)
- [x] Audit Lighthouse (objectif > 90 partout)
- [x] Métadonnées OG pour réseaux sociaux
- [x] Sitemap dynamique
- [x] Fichier robots.txt
- [x] Gestion des erreurs (error.tsx, not-found.tsx)
- [x] Loading states (loading.tsx, Suspense)
- [x] Responsive design mobile validé

---

## Phase 7 — Déploiement Production 🌍
**Durée estimée : 1–2 jours**

- [ ] BDD de production configurée (Neon / Supabase)
- [ ] Variables d'environnement Vercel configurées
- [ ] Migrations Prisma appliquées en prod
- [ ] Clés Stripe live configurées
- [ ] Webhook Stripe pointant sur le domaine de prod
- [ ] Domaine personnalisé configuré
- [ ] Checklist post-déploiement validée
- [ ] Monitoring Vercel Analytics activé

---

## Backlog (fonctionnalités futures)

- [ ] Avis et notes produits
- [ ] Wishlist / favoris
- [ ] Codes promo et remises
- [ ] Multi-langue (i18n)
- [ ] Programme de fidélité
- [ ] Notifications push
- [ ] Application mobile (React Native / Expo)
- [ ] Intégration réseaux sociaux (partage, login)
- [ ] Suivi de colis en temps réel

---

## Légende

| Statut | Signification |
|--------|--------------|
| `[ ]` | À faire |
| `[x]` | Terminé |
| `[~]` | En cours |
| `[!]` | Bloqué |