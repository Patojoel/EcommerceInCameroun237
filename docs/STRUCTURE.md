# 📁 STRUCTURE DU PROJET

Arborescence complète du projet e-commerce Next.js 14 (App Router).

---

```
/
├── 📁 .github/
│   ├── 📁 ISSUE_TEMPLATE/
│   │   ├── bug_report.md          # Template rapport de bug
│   │   └── feature_request.md     # Template demande de fonctionnalité
│   └── pull_request_template.md   # Template Pull Request
│
├── 📁 app/                        # App Router Next.js 14
│   ├── 📁 (auth)/                 # Groupe de routes Auth
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   │
│   ├── 📁 (shop)/                 # Groupe de routes Boutique
│   │   ├── page.tsx               # Page d'accueil
│   │   ├── products/
│   │   │   ├── page.tsx           # Catalogue produits
│   │   │   └── [slug]/page.tsx    # Fiche produit
│   │   ├── categories/
│   │   │   └── [slug]/page.tsx
│   │   ├── cart/page.tsx          # Panier
│   │   └── checkout/
│   │       ├── page.tsx
│   │       └── success/page.tsx
│   │
│   ├── 📁 account/                # Espace client
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   └── profile/page.tsx
│   │
│   ├── 📁 admin/                  # Panel Admin (protégé)
│   │   ├── page.tsx               # Dashboard
│   │   ├── products/
│   │   │   ├── page.tsx           # Liste produits
│   │   │   ├── new/page.tsx
│   │   │   └── [id]/edit/page.tsx
│   │   ├── orders/page.tsx
│   │   └── customers/page.tsx
│   │
│   ├── 📁 api/                    # Routes API
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── products/route.ts
│   │   ├── orders/route.ts
│   │   ├── cart/route.ts
│   │   └── webhook/stripe/route.ts
│   │
│   ├── layout.tsx                 # Layout racine
│   ├── not-found.tsx
│   ├── error.tsx
│   └── globals.css
│
├── 📁 components/
│   ├── 📁 ui/                     # Composants UI de base (shadcn)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   │
│   ├── 📁 layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   │
│   ├── 📁 shop/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductFilters.tsx
│   │   ├── CartItem.tsx
│   │   └── CheckoutForm.tsx
│   │
│   └── 📁 admin/
│       ├── AdminNav.tsx
│       ├── ProductForm.tsx
│       └── OrderTable.tsx
│
├── 📁 lib/
│   ├── prisma.ts                  # Client Prisma
│   ├── stripe.ts                  # Config Stripe
│   ├── auth.ts                    # Config NextAuth
│   ├── cloudinary.ts              # Config Cloudinary
│   └── utils.ts                   # Fonctions utilitaires
│
├── 📁 hooks/
│   ├── useCart.ts
│   ├── useAuth.ts
│   └── useProduct.ts
│
├── 📁 store/                      # State management (Zustand)
│   ├── cartStore.ts
│   └── uiStore.ts
│
├── 📁 prisma/
│   ├── schema.prisma              # Schéma base de données
│   ├── seed.ts                    # Données de test
│   └── 📁 migrations/
│
├── 📁 public/
│   ├── 📁 images/
│   ├── favicon.ico
│   └── robots.txt
│
├── 📁 types/
│   ├── product.ts
│   ├── order.ts
│   ├── user.ts
│   └── index.ts
│
├── 📁 docs/                       # Documentation
│   ├── STRUCTURE.md               # Ce fichier
│   ├── DEPLOYMENT.md
│   ├── TECHNICAL_SPEC.md
│   └── DATABASE_SCHEMA.md
│
├── .env.example                   # Template variables d'environnement
├── .env.local                     # Variables locales (ignoré par Git)
├── .gitignore
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md
├── ROADMAP.md
├── CHANGELOG.md
└── CONTRIBUTING.md
```

---

## Conventions de nommage

| Type | Convention | Exemple |
|------|-----------|---------|
| Composants React | PascalCase | `ProductCard.tsx` |
| Hooks | camelCase + `use` | `useCart.ts` |
| Utilitaires | camelCase | `formatPrice.ts` |
| Routes API | kebab-case | `/api/product-reviews` |
| Variables CSS | kebab-case | `--primary-color` |
| Variables d'env | SCREAMING_SNAKE_CASE | `DATABASE_URL` |

---

## Groupes de routes (App Router)

Les dossiers entre parenthèses `(nom)` sont des **groupes logiques** qui n'affectent pas l'URL :
- `(auth)` → routes publiques d'authentification
- `(shop)` → routes publiques de la boutique

Les routes `/admin` sont protégées via middleware Next.js.
