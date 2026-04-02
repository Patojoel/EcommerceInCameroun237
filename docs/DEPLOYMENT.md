# 🚀 GUIDE DE DÉPLOIEMENT — Vercel

Ce guide couvre le déploiement complet du projet e-commerce sur Vercel,
depuis la configuration initiale jusqu'au passage en production.

---

## Prérequis

- [ ] Compte [Vercel](https://vercel.com) créé
- [ ] Repo GitHub poussé
- [ ] Base de données PostgreSQL distante (ex: Neon, Supabase, Railway)
- [ ] Compte Stripe configuré (clés live)
- [ ] Compte Cloudinary configuré
- [ ] Domaine personnalisé (optionnel)

---

## Étape 1 — Base de données de production

### Option recommandée : Neon (PostgreSQL serverless gratuit)

1. Créer un compte sur [neon.tech](https://neon.tech)
2. Créer un nouveau projet
3. Copier la `DATABASE_URL` fournie
4. Format : `postgresql://user:password@host/dbname?sslmode=require`

### Initialiser le schéma en production

```bash
# Depuis ta machine locale, pointer vers la BDD de prod
DATABASE_URL="postgresql://..." npx prisma migrate deploy
```

> ⚠️ Ne jamais utiliser `prisma migrate dev` en production.

---

## Étape 2 — Import du projet sur Vercel

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. **Import Git Repository** → sélectionner ton repo GitHub
3. Framework preset : **Next.js** (détecté automatiquement)
4. **Ne pas déployer encore** → configurer d'abord les variables d'environnement

---

## Étape 3 — Variables d'environnement sur Vercel

Dans **Project Settings → Environment Variables**, ajouter :

### Base obligatoire

| Variable            | Environnement       | Description                  |
| ------------------- | ------------------- | ---------------------------- |
| `DATABASE_URL`    | Production, Preview | URL PostgreSQL de prod       |
| `NEXTAUTH_URL`    | Production          | `https://votredomaine.com` |
| `NEXTAUTH_SECRET` | Tous                | `openssl rand -base64 32`  |

### Stripe

| Variable                               | Environnement | Description                        |
| -------------------------------------- | ------------- | ---------------------------------- |
| `STRIPE_SECRET_KEY`                  | Production    | Clé secrète live `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Production    | Clé publique live `pk_live_...` |
| `STRIPE_WEBHOOK_SECRET`              | Production    | Clé webhook `whsec_...`         |

### Cloudinary

| Variable                  | Environnement | Description  |
| ------------------------- | ------------- | ------------ |
| `CLOUDINARY_CLOUD_NAME` | Tous          | Nom du cloud |
| `CLOUDINARY_API_KEY`    | Tous          | Clé API     |
| `CLOUDINARY_API_SECRET` | Tous          | Secret API   |

### Email (Resend)

| Variable           | Environnement | Description                  |
| ------------------ | ------------- | ---------------------------- |
| `RESEND_API_KEY` | Production    | Clé API Resend              |
| `EMAIL_FROM`     | Production    | `noreply@votredomaine.com` |

---

## Étape 4 — Déploiement initial

```bash
# Option A — Via Vercel CLI
npm i -g vercel
vercel login
vercel --prod

# Option B — Via GitHub (recommandé)
git push origin main   # déclenche automatiquement le déploiement
```

---

## Étape 5 — Configurer le Webhook Stripe

1. Aller sur [dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
2. **Add endpoint** → `https://votredomaine.vercel.app/api/webhook/stripe`
3. Sélectionner les événements :
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `checkout.session.completed`
4. Copier le **Signing secret** → ajouter comme `STRIPE_WEBHOOK_SECRET` sur Vercel
5. Redéployer le projet

---

## Étape 6 — Domaine personnalisé (optionnel)

1. Vercel → **Project Settings → Domains**
2. Ajouter `votredomaine.com`
3. Configurer les DNS chez ton registrar :
   ```
   Type  Name   Value
   A     @      76.76.21.21
   CNAME www    cname.vercel-dns.com
   ```
4. Mettre à jour `NEXTAUTH_URL` avec le vrai domaine
5. Mettre à jour le Webhook Stripe avec le vrai domaine

---

## Étape 7 — Vérifications post-déploiement

### Checklist fonctionnelle

- [ ] Page d'accueil s'affiche correctement
- [ ] Catalogue produits charge bien
- [ ] Inscription / Connexion fonctionnent
- [ ] Ajout au panier fonctionne
- [ ] Paiement Stripe en mode live réussi
- [ ] Email de confirmation reçu
- [ ] Panel admin accessible (rôle ADMIN)
- [ ] Upload d'images via Cloudinary

### Checklist technique

- [ ] Score Lighthouse > 90
- [ ] HTTPS actif (automatique sur Vercel)
- [ ] Toutes les variables d'env présentes
- [ ] Pas d'erreurs dans les Vercel Logs
- [ ] Sitemap accessible : `/sitemap.xml`
- [ ] Robots.txt accessible : `/robots.txt`

---

## Environnements Vercel

| Branche Git   | Environnement Vercel | URL                                   |
| ------------- | -------------------- | ------------------------------------- |
| `main`      | Production           | `votredomaine.com`                  |
| `develop`   | Preview              | `projet-git-develop.vercel.app`     |
| `feature/*` | Preview              | `projet-git-feature-xyz.vercel.app` |

---

## Commandes utiles

```bash
# Voir les logs de déploiement
vercel logs

# Rollback vers un déploiement précédent
vercel rollback

# Inspecter les variables d'env
vercel env ls

# Ouvrir le projet dans le navigateur
vercel open
```

---

## Dépannage fréquent

| Problème          | Solution                                                        |
| ------------------ | --------------------------------------------------------------- |
| Build échoue      | Vérifier les logs Vercel, souvent une variable d'env manquante |
| BDD inaccessible   | Vérifier `DATABASE_URL` et `?sslmode=require`              |
| NextAuth erreur    | Vérifier `NEXTAUTH_URL` = URL exacte de production           |
| Webhook Stripe 400 | Vérifier `STRIPE_WEBHOOK_SECRET` et la signature             |
| Images 404         | Ajouter le domaine Cloudinary dans `next.config.js`           |
