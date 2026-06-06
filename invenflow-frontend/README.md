# InvenFlow Frontend

Production-ready Angular 21 SPA for the InvenFlow inventory management backend (Spring Boot).

## Prerequisites

- Node.js 22+ (LTS recommended)
- npm 11+
- Angular CLI 21: `npm i -g @angular/cli@21`
- Backend running at `http://localhost:8081` (see `../invenflow-backend-main`)

## Quick Start

```bash
cd invenflow-frontend
npm install
npm start
```

Open http://localhost:4200.

**Start the backend first** (required for login):

```bash
cd ../invenflow-backend-main
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The `dev` profile uses an in-memory H2 database (no PostgreSQL needed locally).

API calls go to `http://localhost:8081/api` (see `src/environments/environment.ts`). `npm start` also enables a dev proxy via `proxy.conf.json`.

### Login

- Any email with password length ≥ 4
- Email containing `admin` → Admin role with full permissions
- Other emails → Inventory Manager (no `manageUsers`)

Example: `admin@invenflow.com` / `admin`

## Environment

| Variable | File | Default | Description |
|----------|------|---------|-------------|
| `apiBaseUrl` | `src/environments/environment.ts` | `/api` | API prefix (proxied in dev) |
| Backend URL | `proxy.conf.json` | `http://localhost:8081` | Dev proxy target |

Production builds use `environment.prod.ts`. Deploy behind nginx with `/api` reverse proxy (see `nginx.conf`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Dev server with proxy |
| `npm run build` | Development build |
| `npm run build:prod` | Production build |
| `npm test` | Unit tests (Vitest) |
| `npm run test:ci` | CI unit tests |

## Docker

```bash
docker build -t invenflow-frontend .
docker run -p 8080:80 invenflow-frontend
```

Pair with backend container named `backend` on port 8081, or update `nginx.conf`.

## OpenAPI

Generated spec: `openapi/invenflow-api.yaml`

Regenerate TypeScript types (optional):

```bash
npx openapi-typescript openapi/invenflow-api.yaml -o src/app/shared/models/api.generated.ts
```

## Architecture

- **Standalone components** with lazy-loaded routes
- **Signal-based auth state** (`AuthService`)
- **Angular Material** UI
- **HttpInterceptor** for Bearer token + global error snackbars
- **Route guards** for auth and permission-based navigation

## Features

| Route | Backend Resource |
|-------|------------------|
| `/dashboard` | Aggregated stats + low stock |
| `/products` | `/api/products` |
| `/stock` | `/api/stock/*` |
| `/inventory` | `/api/inventory` |
| `/warehouses` | `/api/warehouses` |
| `/suppliers` | `/api/suppliers` |
| `/customers` | `/api/customers` |
| `/orders/purchase` | `/api/orders/purchase` |
| `/orders/sales` | `/api/orders/sales` |
| `/payments` | `/api/payments` |
| `/users` | `/api/users` |

## E2E Tests

```bash
npm i -D @playwright/test
npx playwright install
# Start backend + frontend, then:
npx playwright test e2e/login-product.spec.ts
```

## CI

GitHub Actions workflow: `.github/workflows/ci.yml` — install, test, build, Docker on `main`.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| CORS errors | Use `npm start` proxy; backend has `@CrossOrigin` on controllers |
| 401 on login | Password must be ≥ 4 chars |
| Empty lists | Ensure PostgreSQL env vars set for backend |
| Product CORS from non-4200 origin | `ProductController` only allows `http://localhost:4200` — use proxy or update backend |

## Effort Estimate

| Role | Hours |
|------|-------|
| Frontend engineer | 80–120h |
| UI/UX designer | 16–24h |
| QA engineer | 24–32h |
| **Total** | **120–176h** |
