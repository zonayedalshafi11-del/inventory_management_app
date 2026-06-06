# Inventory Management App (InvenFlow)

Full-stack inventory management system.

| Folder | Stack | Description |
|--------|-------|-------------|
| `invenflow-frontend/` | Angular 21 + Material | Web UI |
| `invenflow-backend-main/` | Spring Boot 4 + PostgreSQL/H2 | REST API |

## Quick start

### Backend (local dev — H2, no PostgreSQL)

```bash
cd invenflow-backend-main
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

Runs at http://localhost:8081

### Frontend

```bash
cd invenflow-frontend
npm install
npm start
```

Open http://localhost:4200

**Login (mock auth):** any email + password (min 4 chars). Email containing `admin` → Admin role.  
Example: `admin@invenflow.com` / `admin`

See each subfolder README for more details.
