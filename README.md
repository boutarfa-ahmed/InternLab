# InternLab 🎓

> Plateforme de mise en relation étudiants ↔ entreprises pour les stages

## Stack

| Couche | Tech |
|--------|------|
| Frontend | React 18 + Vite + Tailwind + Shadcn/ui |
| Backend | Node.js + Express |
| ORM | Prisma |
| Base de données | PostgreSQL (Neon) |
| Auth | JWT + Refresh Tokens |
| Fichiers | Cloudinary |
| Email | Nodemailer + Gmail SMTP |

## Structure

```
internlab/
├── client/         → Frontend React + Vite
├── server/         → Backend Express + Prisma
└── shared/         → Zod schemas partagés
```

## Démarrage rapide

```bash
# 1. Cloner
git clone https://github.com/boutarfa-ahmed/internlab.git
cd internlab

# 2. Installer toutes les dépendances
npm run install:all

# 3. Configurer les variables d'environnement
cp server/.env.example server/.env
cp client/.env.example client/.env

# 4. Initialiser la base de données
cd server && npx prisma migrate dev

# 5. Démarrer en développement
cd .. && npm run dev
```

## Scripts disponibles (racine)

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance client + server en parallèle |
| `npm run dev:client` | Lance uniquement le frontend |
| `npm run dev:server` | Lance uniquement le backend |
| `npm run install:all` | Installe toutes les dépendances |
| `npm run lint` | Lint client + server |

## Sprints

- [x] Sprint 0 — Setup & Structure
- [ ] Sprint 1 — Authentification
- [ ] Sprint 2 — CRUD Offres
- [ ] Sprint 3 — Candidatures
- [ ] Sprint 4 — Dashboards
- [ ] Sprint 5 — Notifications & Email
- [ ] Sprint 6 — Tests & Déploiement

## Contributeurs

- Ahmed Boutarfa