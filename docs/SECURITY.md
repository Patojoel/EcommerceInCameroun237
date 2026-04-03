# 🔒 POLITIQUE DE SÉCURITÉ

## Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité, **ne créez PAS d'issue publique**.

Envoyez un email à : **security@ecommerce237.com** (ou via message privé au mainteneur)

Incluez :
- Description de la vulnérabilité
- Étapes pour la reproduire
- Impact potentiel
- Solution suggérée (si applicable)

Nous nous engageons à répondre sous **48 heures**.

---

## Mesures de sécurité en place

### 🔐 Authentification
- Mots de passe hashés avec **bcryptjs** (salt rounds = 10)
- Sessions gérées par **NextAuth.js** avec tokens JWT
- OAuth via Google (pas de stockage de mot de passe tiers)
- Protection CSRF intégrée via NextAuth
- Reset de mot de passe via token temporaire avec expiration

### 🛡️ Protection des routes
- Middleware Next.js pour les routes protégées (`/admin/*`, `/account/*`, `/checkout`)
- Vérification du rôle ADMIN pour le panel d'administration
- Routes API protégées par vérification de session

### 🌐 Headers HTTP sécurisés
Configurés dans `next.config.js` :
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 💳 Paiement
- Intégration Stripe avec clés **serveur-only**
- Webhook Stripe vérifié par **signature cryptographique**
- Montants calculés côté serveur uniquement
- Pas de données de carte stockées (géré par Stripe)

### 📊 Données
- Validation des inputs avec **Zod** avant traitement
- Prisma ORM avec requêtes paramétrées (pas de SQL injection)
- Variables sensibles uniquement côté serveur (.env non exposé)
- `X-Powered-By` header supprimé

### 🗄️ Base de données
- Connexion SSL obligatoire (`sslmode=require`)
- Permissions limitées au strict nécessaire
- Pas de données sensibles en clair

---

## Variables d'environnement

### ⚠️ Règles strictes

| Règle | Détail |
|-------|--------|
| Ne JAMAIS commit `.env.local` | Vérifié via `.gitignore` |
| Préfixe `NEXT_PUBLIC_` | **Uniquement** pour les vars exposées au client |
| Secrets | Toujours côté serveur (sans `NEXT_PUBLIC_`) |
| Rotation | Changer les secrets régulièrement |
| Production | Utiliser les clés Stripe **live** (pas test) |

### Variables côté serveur uniquement
- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `CLOUDINARY_API_SECRET`
- `RESEND_API_KEY`

### Variables exposées au client
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_APP_NAME`

---

## Checklist de sécurité production

- [x] Mots de passe hashés (bcrypt)
- [x] Sessions JWT avec secret fort
- [x] Headers de sécurité HTTP
- [x] Middleware de protection des routes
- [x] Webhook Stripe vérifié
- [x] Validation inputs (Zod)
- [x] Prisma ORM (pas de SQL brut)
- [x] `.gitignore` couvre `.env.local`
- [x] `X-Powered-By` supprimé
- [ ] Rate limiting sur `/api/auth/*`
- [ ] Monitoring des erreurs (Sentry)
- [ ] Audit de dépendances (`npm audit`)
- [ ] Content Security Policy (CSP)

---

## Dépendances

Exécuter régulièrement :
```bash
# Vérifier les vulnérabilités connues
npm audit

# Corriger automatiquement les vulnérabilités
npm audit fix

# Mettre à jour les dépendances
npm update
```

---

## Versions supportées

| Version | Supportée |
|---------|-----------|
| 0.1.x   | ✅ Oui   |
| < 0.1   | ❌ Non   |
