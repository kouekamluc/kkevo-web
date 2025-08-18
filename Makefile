.PHONY: help dev build up down logs clean migrate superuser seed test lint format

help: ## Show this help message
	@echo "KKEVO Web Development Commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

dev: ## Start all services in development mode
	docker-compose up -d
	@echo "🚀 Development environment started!"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔧 Backend: http://localhost:8081"
	@echo "🗄️  Database: localhost:5432"

build: ## Build all Docker images
	docker-compose build

up: ## Start all services
	docker-compose up -d

down: ## Stop all services
	docker-compose down

logs: ## Show logs for all services
	docker-compose logs -f

clean: ## Clean up containers, images, and volumes
	docker-compose down -v --rmi all
	docker system prune -f

migrate: ## Run Django migrations
	docker-compose exec backend python manage.py migrate

makemigrations: ## Create Django migrations
	docker-compose exec backend python manage.py makemigrations

superuser: ## Create Django superuser
	docker-compose exec backend python manage.py createsuperuser

seed: ## Seed demo data
	docker-compose exec backend python manage.py seed_demo

shell: ## Open Django shell
	docker-compose exec backend python manage.py shell

collectstatic: ## Collect static files
	docker-compose exec backend python manage.py collectstatic --noinput

test: ## Run tests
	docker-compose exec backend python manage.py test
	cd frontend && npm run test

lint: ## Lint code
	docker-compose exec backend flake8 .
	cd frontend && npm run lint

format: ## Format code
	docker-compose exec backend black .
	cd frontend && npm run format

install-deps: ## Install dependencies
	cd backend && pipenv install
	cd frontend && npm install

reset-db: ## Reset database and seed fresh data
	docker-compose down -v
	docker-compose up -d postgres
	sleep 5
	docker-compose up -d backend
	sleep 10
	docker-compose exec backend python manage.py migrate
	docker-compose exec backend python manage.py seed_demo
	@echo "🔄 Database reset complete!"

status: ## Show service status
	docker-compose ps
