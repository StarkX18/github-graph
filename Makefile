.PHONY: install install-backend install-all dev dev-backend build preview

# ─── Setup ────────────────────────────────────────────────────────────────────
install:
	cd frontend && npm install

install-backend:
	cd backend && npm install

install-all: install install-backend

# ─── Development ──────────────────────────────────────────────────────────────
# Run these in two separate terminals:
#   make dev-backend
#   make dev
dev:
	cd frontend && npm run dev

dev-backend:
	cd backend && npm run dev

# ─── Production ───────────────────────────────────────────────────────────────
build:
	cd frontend && npm run build

preview: build
	cd frontend && npm run preview
