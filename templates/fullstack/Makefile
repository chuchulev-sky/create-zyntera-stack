# Load environment variables from .env (optional: use `-include .env` so missing .env doesn't break `make help`)
-include .env
export

.PHONY: db up down down-volumes migrate migrate-dev-compose studio ci ci-all

# --- Docker (dev stack: docker-compose.yml) ---
db:
	docker compose up -d db

up:
	docker compose up -d

# Stop containers; keep volumes (safe default)
down:
	docker compose down

# Stop and remove volumes (DESTROYS local MySQL data)
down-volumes:
	docker compose down -v

# --- Migrations ---
# Uses DATABASE_URL from your environment / .env (run from repo root, Drizzle CLI on host).
migrate:
	npx drizzle-kit migrate

# Dev stack: run migrations inside the **app** container (has devDependencies via bind mount + node_modules volume).
# Requires `docker compose up -d` with app+db healthy.
migrate-dev-compose:
	docker compose exec app npx drizzle-kit migrate

# First deploy / prod compose note:
# The production API image (`docker-compose.prod.yml` api service) typically has NO drizzle-kit (omit=dev).
# Run migrations from CI or your laptop with DATABASE_URL pointing at prod MySQL (VPN/SSH tunnel), OR use migrate-dev-compose against a prod-like stack that includes drizzle-kit.
# Example placeholder for when you add a migrate sidecar image:
# migrate-prod-compose:
#	docker compose -f docker-compose.prod.yml run --rm migrate

# --- Tooling ---
studio:
	npx drizzle-kit studio

# Backend-only local CI
ci:
	npm run lint
	npm run build
	npm run test

# Full monorepo checks (optional)
ci-all: ci
	cd apps/web && npm ci && npm run lint && npm run build && npm run test