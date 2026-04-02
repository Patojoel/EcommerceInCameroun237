# ⚙️ SPÉCIFICATIONS TECHNIQUES

## 1. Architecture globale

```
Client (Browser)
      │
      ▼
  Next.js 14 (Vercel Edge Network)
  ├── App Router (SSR / SSG / ISR)
  ├── API Routes (serverless functions)
  └── Middleware (auth, redirections)
      │
      ├──► PostgreSQL (via Prisma)
      ├──► Stripe (paiement)
      ├──► Cloudinary (médias)
      └──► Resend (emails transactionnels)
```

---

## 2. Dépendances principales

### Core
```json
{
  "next": "^14.x",
  "react": "^18.x",
  "react-dom": "^18.x",
  "typescript": "^5.x"
}
```

### Base de données & Auth
```json
{
  "@prisma/client": "^5.x",
  "prisma": "^5.x",
  "next-auth": "^4.x",
  "bcryptjs": "^2.x"
}
```

### UI & Styling
```json
{
  "tailwindcss": "^3.x",
  "@radix-ui/react-*": "latest",
  "class-variance-authority": "latest",
  "clsx": "latest",
  "lucide-react": "latest"
}
```

### Paiement & Médias
```json
{
  "stripe": "^14.x",
  "@stripe/stripe-js": "^2.x",
  "@stripe/react-stripe-js": "^2.x",
  "cloudinary": "^1.x"
}
```

### State & Formulaires
```json
{
  "zustand": "^4.x",
  "react-hook-form": "^7.x",
  "zod": "^3.x",
  "@hookform/resolvers": "^3.x"
}
```

---

## 3. Schéma de base de données (Prisma)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?
  role      Role     @default(CUSTOMER)
  orders    Order[]
  createdAt DateTime @default(now())
}

model Product {
  id          String      @id @default(cuid())
  name        String
  slug        String      @unique
  description String
  price       Float
  stock       Int         @default(0)
  images      String[]
  category    Category    @relation(fields: [categoryId], references: [id])
  categoryId  String
  orderItems  OrderItem[]
  createdAt   DateTime    @default(now())
}

model Category {
  id       String    @id @default(cuid())
  name     String
  slug     String    @unique
  products Product[]
}

model Order {
  id         String      @id @default(cuid())
  user       User        @relation(fields: [userId], references: [id])
  userId     String
  items      OrderItem[]
  total      Float
  status     OrderStatus @default(PENDING)
  stripeId   String?
  createdAt  DateTime    @default(now())
}

model OrderItem {
  id        String  @id @default(cuid())
  order     Order   @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product @relation(fields: [productId], references: [id])
  productId String
  quantity  Int
  price     Float
}

enum Role {
  CUSTOMER
  ADMIN
}

enum OrderStatus {
  PENDING
  PAID
  SHIPPED
  DELIVERED
  CANCELLED
}
```

---

## 4. Stratégie de rendu

| Page | Stratégie | Justification |
|------|-----------|---------------|
| Accueil | ISR (60s) | Contenu semi-dynamique |
| Catalogue produits | ISR (30s) | Fréquence de changement modérée |
| Fiche produit | ISR (10s) | Stock en temps quasi-réel |
| Panier | CSR | Données utilisateur |
| Checkout | SSR | Sécurité paiement |
| Admin | SSR | Données temps réel |
| Blog/CMS | SSG | Contenu statique |

---

## 5. Middleware de protection des routes

```
/admin/*    → Rôle ADMIN requis
/account/*  → Authentification requise
/checkout   → Authentification requise
/api/admin/* → Rôle ADMIN requis
```

---

## 6. Performance & SEO

- **Images** : `next/image` avec Cloudinary comme provider
- **Fonts** : `next/font` (Google Fonts en local)
- **Metadata** : `generateMetadata()` par page
- **Sitemap** : `/app/sitemap.ts` généré dynamiquement
- **Robots** : `/app/robots.ts`
- **Core Web Vitals** : Suivi via Vercel Analytics

---

## 7. Sécurité

- [ ] Variables sensibles uniquement côté serveur
- [ ] Validation des inputs avec Zod
- [ ] Webhook Stripe vérifié par signature
- [ ] Headers HTTP sécurisés (`next.config.js`)
- [ ] Rate limiting sur les routes API critiques
- [ ] CSRF protection via NextAuth
- [ ] Sanitisation des données avant insertion BDD
