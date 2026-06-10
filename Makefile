.PHONY: install install-backend install-all dev dev-backend build preview install-service uninstall-service service-status

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

# ─── LaunchAgent (auto-start on login) ────────────────────────────────────────
PLIST_SRC  := $(shell pwd)/com.sid.github-graph.plist
PLIST_DEST := $(HOME)/Library/LaunchAgents/com.sid.github-graph.plist

install-service: build
	cp $(PLIST_SRC) $(PLIST_DEST)
	launchctl load -w $(PLIST_DEST)
	@echo "Service installed. App is at http://localhost:3001"

uninstall-service:
	-launchctl unload -w $(PLIST_DEST)
	-rm $(PLIST_DEST)
	@echo "Service removed."

service-status:
	launchctl list | grep github-graph || echo "Service not running"