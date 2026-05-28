.PHONY: install dev build preview

# ─── Setup ────────────────────────────────────────────────────────────────────
install:
	cd frontend && npm install

# ─── Development ──────────────────────────────────────────────────────────────
dev:
	cd frontend && npm run dev

# ─── Production ───────────────────────────────────────────────────────────────
build:
	cd frontend && npm run build

preview: build
	cd frontend && npm run preview
