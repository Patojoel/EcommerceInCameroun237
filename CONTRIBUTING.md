# 🤝 CONTRIBUTING

Guide de contribution et conventions du projet.

---

## Workflow Git

```
main           ← production (déploiement automatique Vercel)
  └── develop  ← branche d'intégration
        ├── feature/nom-fonctionnalité
        ├── fix/description-du-bug
        └── chore/tâche-technique
```

### Règles de base

1. **Ne jamais committer directement sur `main`**
2. Toujours partir de `develop` pour créer une branche
3. Une branche = une fonctionnalité ou un fix
4. Pull Request obligatoire pour merger dans `develop`

---

## Conventions de commit (Conventional Commits)

Format : `type(scope): description courte`

### Types

| Type | Usage |
|------|-------|
| `feat` | Nouvelle fonctionnalité |
| `fix` | Correction de bug |
| `chore` | Tâche technique (deps, config) |
| `docs` | Documentation uniquement |
| `style` | Formatage, CSS (pas de logique) |
| `refactor` | Refactorisation sans nouveau comportement |
| `perf` | Amélioration de performance |
| `test` | Ajout ou correction de tests |
| `revert` | Annulation d'un commit précédent |

### Exemples

```bash
git commit -m "feat(cart): ajouter la persistance du panier localStorage"
git commit -m "fix(checkout): corriger le calcul des frais de livraison"
git commit -m "chore(deps): mettre à jour Stripe vers v14"
git commit -m "docs(readme): ajouter les instructions de setup"
git commit -m "style(product-card): ajuster le responsive mobile"
```

---

## Nommage des branches

```bash
feature/panier-persistant
feature/auth-google-oauth
fix/bug-prix-produit
fix/stripe-webhook-404
chore/update-dependencies
docs/guide-deploiement
```

---

## Créer une nouvelle fonctionnalité

```bash
# 1. Se mettre à jour sur develop
git checkout develop
git pull origin develop

# 2. Créer une nouvelle branche
git checkout -b feature/ma-fonctionnalite

# 3. Développer, committer régulièrement
git add .
git commit -m "feat(scope): description"

# 4. Pousser et ouvrir une Pull Request
git push origin feature/ma-fonctionnalite
```

---

## Standards de code

### TypeScript
- Typage strict activé (`"strict": true` dans tsconfig)
- Pas de `any` — utiliser `unknown` si nécessaire
- Interfaces pour les objets de données, types pour les unions

### Composants React
- Un composant = un fichier
- Props typées avec une interface nommée `[Composant]Props`
- Composants côté serveur par défaut, `"use client"` seulement si nécessaire

```typescript
// ✅ Bon
interface ProductCardProps {
  product: Product;
  onAddToCart?: (id: string) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // ...
}

// ❌ Éviter
export default function ProductCard(props: any) {
  // ...
}
```

### Appels API
- Validation des inputs avec **Zod** dans toutes les routes API
- Retourner des erreurs HTTP cohérentes (400, 401, 403, 404, 500)
- Pas de logique métier dans les composants → utiliser des fonctions dans `/lib`

### CSS
- Utiliser les classes Tailwind en priorité
- Éviter les styles inline
- Les variants de composants via `class-variance-authority`

---

## Structure d'une Pull Request

**Titre** : `feat(scope): description de la fonctionnalité`

**Description** :
```markdown
## Changements
- Quoi a été fait

## Pourquoi
- Contexte et motivation

## Comment tester
1. Étape 1
2. Étape 2

## Screenshots (si UI)
[images ici]

## Checklist
- [ ] Code reviewé par soi-même
- [ ] Pas d'erreurs TypeScript
- [ ] Testé en local
- [ ] Variables d'env documentées dans .env.example si nouvelles
```
