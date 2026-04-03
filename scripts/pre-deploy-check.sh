#!/bin/bash
# =============================================
# 🔍 Script de vérification pré-déploiement
# EcommerceInCameroun237
# =============================================
# Usage : chmod +x scripts/pre-deploy-check.sh && ./scripts/pre-deploy-check.sh
# =============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

PASS=0
FAIL=0
WARN=0

pass() {
  echo -e "  ${GREEN}✅ $1${NC}"
  PASS=$((PASS + 1))
}

fail() {
  echo -e "  ${RED}❌ $1${NC}"
  FAIL=$((FAIL + 1))
}

warn() {
  echo -e "  ${YELLOW}⚠️  $1${NC}"
  WARN=$((WARN + 1))
}

section() {
  echo ""
  echo -e "${BLUE}${BOLD}━━━ $1 ━━━${NC}"
}

# ─────────────────────────────────────────────
section "1. Vérification des fichiers essentiels"
# ─────────────────────────────────────────────

FILES=(
  "package.json"
  "next.config.js"
  "tsconfig.json"
  "prisma/schema.prisma"
  "middleware.ts"
  ".env.example"
  ".gitignore"
  "app/layout.tsx"
  "app/sitemap.ts"
  "app/robots.ts"
  "app/error.tsx"
  "app/not-found.tsx"
  "app/loading.tsx"
)

for f in "${FILES[@]}"; do
  if [ -f "$f" ]; then
    pass "$f existe"
  else
    fail "$f MANQUANT"
  fi
done

# ─────────────────────────────────────────────
section "2. Vérification .gitignore"
# ─────────────────────────────────────────────

if grep -q ".env.local" .gitignore 2>/dev/null; then
  pass ".env.local est dans .gitignore"
else
  fail ".env.local n'est PAS dans .gitignore"
fi

if grep -q "node_modules" .gitignore 2>/dev/null; then
  pass "node_modules est dans .gitignore"
else
  fail "node_modules n'est PAS dans .gitignore"
fi

if grep -q ".next" .gitignore 2>/dev/null; then
  pass ".next est dans .gitignore"
else
  fail ".next n'est PAS dans .gitignore"
fi

# ─────────────────────────────────────────────
section "3. Vérification .env.example"
# ─────────────────────────────────────────────

REQUIRED_VARS=(
  "DATABASE_URL"
  "NEXTAUTH_SECRET"
  "NEXTAUTH_URL"
  "STRIPE_SECRET_KEY"
  "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
  "STRIPE_WEBHOOK_SECRET"
  "CLOUDINARY_CLOUD_NAME"
  "CLOUDINARY_API_KEY"
  "CLOUDINARY_API_SECRET"
  "RESEND_API_KEY"
)

for var in "${REQUIRED_VARS[@]}"; do
  if grep -q "$var" .env.example 2>/dev/null; then
    pass "$var documenté dans .env.example"
  else
    fail "$var MANQUANT dans .env.example"
  fi
done

# ─────────────────────────────────────────────
section "4. Vérification Prisma"
# ─────────────────────────────────────────────

if npx prisma validate 2>/dev/null; then
  pass "Schéma Prisma valide"
else
  fail "Schéma Prisma INVALIDE"
fi

# ─────────────────────────────────────────────
section "5. Vérification TypeScript"
# ─────────────────────────────────────────────

if npx prisma generate 2>/dev/null && npx tsc --noEmit 2>/dev/null; then
  pass "Pas d'erreurs TypeScript"
else
  fail "Erreurs TypeScript détectées"
fi

# ─────────────────────────────────────────────
section "6. Vérification ESLint"
# ─────────────────────────────────────────────

if npm run lint 2>/dev/null; then
  pass "ESLint : aucune erreur"
else
  warn "ESLint : des warnings ou erreurs détectés"
fi

# ─────────────────────────────────────────────
section "7. Vérification de sécurité"
# ─────────────────────────────────────────────

# Check next.config.js for security headers
if grep -q "X-Frame-Options" next.config.js 2>/dev/null; then
  pass "Header X-Frame-Options configuré"
else
  warn "Header X-Frame-Options manquant dans next.config.js"
fi

if grep -q "X-Content-Type-Options" next.config.js 2>/dev/null; then
  pass "Header X-Content-Type-Options configuré"
else
  warn "Header X-Content-Type-Options manquant"
fi

if grep -q "poweredByHeader: false" next.config.js 2>/dev/null; then
  pass "X-Powered-By supprimé"
else
  warn "X-Powered-By pas supprimé"
fi

# Check for exposed secrets
if grep -rq "sk_live_" --include="*.ts" --include="*.tsx" --include="*.js" app/ lib/ components/ 2>/dev/null; then
  fail "Clé Stripe LIVE trouvée dans le code source !"
else
  pass "Aucune clé Stripe live dans le code"
fi

if grep -rq "sk_test_" --include="*.ts" --include="*.tsx" --include="*.js" app/ lib/ components/ 2>/dev/null; then
  warn "Clé Stripe TEST trouvée en dur dans le code"
else
  pass "Aucune clé Stripe test en dur"
fi

# ─────────────────────────────────────────────
section "8. Build de production"
# ─────────────────────────────────────────────

echo -e "  ${YELLOW}⏳ Build en cours...${NC}"
if npm run build 2>/dev/null; then
  pass "Build de production réussi"
else
  fail "Build de production ÉCHOUÉ"
fi

# ─────────────────────────────────────────────
section "9. Audit des dépendances"
# ─────────────────────────────────────────────

AUDIT_RESULT=$(npm audit --json 2>/dev/null || true)
CRITICAL=$(echo "$AUDIT_RESULT" | grep -o '"critical":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")
HIGH=$(echo "$AUDIT_RESULT" | grep -o '"high":[0-9]*' | head -1 | grep -o '[0-9]*' || echo "0")

if [ "$CRITICAL" -gt 0 ]; then
  fail "$CRITICAL vulnérabilités critiques détectées"
elif [ "$HIGH" -gt 0 ]; then
  warn "$HIGH vulnérabilités hautes détectées"
else
  pass "Aucune vulnérabilité critique ou haute"
fi

# ─────────────────────────────────────────────
# Résumé
# ─────────────────────────────────────────────
echo ""
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}  📊 RÉSUMÉ PRÉ-DÉPLOIEMENT${NC}"
echo -e "${BOLD}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""
echo -e "  ${GREEN}✅ Réussi : $PASS${NC}"
echo -e "  ${YELLOW}⚠️  Avertissements : $WARN${NC}"
echo -e "  ${RED}❌ Échecs : $FAIL${NC}"
echo ""

if [ $FAIL -gt 0 ]; then
  echo -e "  ${RED}${BOLD}🚫 DÉPLOIEMENT NON RECOMMANDÉ — Corrigez les erreurs ci-dessus.${NC}"
  exit 1
else
  if [ $WARN -gt 0 ]; then
    echo -e "  ${YELLOW}${BOLD}⚠️  DÉPLOIEMENT POSSIBLE — Revérifiez les avertissements.${NC}"
  else
    echo -e "  ${GREEN}${BOLD}🎉 PRÊT POUR LE DÉPLOIEMENT !${NC}"
  fi
  exit 0
fi
