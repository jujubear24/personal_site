# Makefile for deploying services

.PHONY: deploy deploy-all deploy-frontend reset-dev add-license help clean dev dev-docker dev-down dev-logs

# Default target
help:
	@echo "Available targets:"
	@echo ""
	@echo "  Development (Docker):"
	@echo "    dev             - Start backend (Docker) + frontend (native)"
	@echo "    dev-docker      - Start backend in Docker only"
	@echo "    dev-down        - Stop Docker services"
	@echo "    dev-logs        - View Docker container logs"
	@echo ""
	@echo "  Deployment:"
	@echo "    deploy          - Deploy the FFP project"
	@echo "    deploy-all      - Deploy AI service + Frontend together"
	@echo "    deploy-frontend - Deploy the frontend web UI service"
	@echo ""
	@echo "  Utilities:"
	@echo "    reset-dev       - Reset dev branch from main"
	@echo "    add-license     - Add license headers to source files"
	@echo "    clean           - Clean build artifacts and logs"
	@echo "    help            - Show this help message"

# ──────────────────────────────────────────────────────────────
# Development (Docker)
# ──────────────────────────────────────────────────────────────

dev: ## Start backend (Docker) + frontend (native) in parallel
	@echo "🚀 Starting development environment..."
	@echo "   Backend:  Docker (http://localhost:8081)"
	@echo "   Frontend: Native (http://localhost:3000)"
	@echo ""
	@trap 'docker compose down' EXIT; \
	docker compose up --build & \
	cd services/frontend && npm run dev

dev-docker: ## Start backend in Docker only
	@echo "🐳 Starting backend in Docker..."
	docker compose up --build

dev-down: ## Stop Docker services
	@echo "🛑 Stopping Docker services..."
	docker compose down

dev-logs: ## View Docker container logs
	docker compose logs -f

# ──────────────────────────────────────────────────────────────
# Deployment
# ──────────────────────────────────────────────────────────────

# Deploy the FFP project
deploy:
	@echo "🚀 Deploying FFP project..."
	@original_dir="$$PWD"; \
	trap 'cd "$$original_dir" 2>/dev/null || exit; printf "\nReturned to original directory: %s\n" "$$original_dir"' EXIT; \
	cd scripts && \
	chmod +x reset-dev-branch.sh deploy-frontend-service.sh && \
	echo "🔄 Running reset-dev-branch.sh..." && \
	./reset-dev-branch.sh && \
	echo "🌐 Running deploy-frontend-service.sh..." && \
	./deploy-frontend-service.sh

# Deploy AI service + Frontend together
deploy-all:
	@echo "🚀 Starting full deployment (AI + Frontend)..."
	@chmod +x scripts/deploy-all.sh
	@cd scripts && ./deploy-all.sh

# Deploy the frontend web UI service
deploy-frontend:
	@echo "🚀 Starting frontend service deployment..."
	@chmod +x scripts/deploy-frontend-service.sh
	@cd scripts && ./deploy-frontend-service.sh

# ──────────────────────────────────────────────────────────────
# Utilities
# ──────────────────────────────────────────────────────────────

# Reset dev branch from main
reset-dev:
	@echo "🔄 Resetting dev branch from main..."
	@chmod +x scripts/reset-dev-branch.sh
	@cd scripts && ./reset-dev-branch.sh

# Add license headers to source files
add-license:
	@echo "📄 Adding license headers to source files..."
	@chmod +x scripts/add-license.sh
	@cd scripts && ./add-license.sh

# Clean build artifacts and logs
clean:
	@echo "🧹 Cleaning build artifacts and logs..."
	@rm -rf services/frontend/.next
	@rm -rf services/frontend/out
	@rm -rf services/frontend/node_modules/.cache
	@rm -f scripts/logs/*.log
	@docker compose down -v 2>/dev/null || true
	@echo "✨ Clean completed!"