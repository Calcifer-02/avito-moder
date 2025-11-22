# Makefile для управления Docker контейнерами
# Использование: make <команда>

.PHONY: help build up down restart logs clean test dev prod status

# Цвета для вывода
GREEN=\033[0;32m
YELLOW=\033[1;33m
NC=\033[0m # No Color

help: ## Показать справку по командам
	@echo "$(GREEN)Доступные команды:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'

# Production команды
build: ## Собрать Docker образы (production)
	@echo "$(GREEN)Сборка production образов...$(NC)"
	docker-compose build

up: ## Запустить приложение (production)
	@echo "$(GREEN)Запуск production версии...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Приложение запущено!$(NC)"
	@echo "Frontend: http://localhost:3000"
	@echo "Backend: http://localhost:3001/api/v1"

down: ## Остановить и удалить контейнеры
	@echo "$(YELLOW)Остановка контейнеров...$(NC)"
	docker-compose down

restart: ## Перезапустить контейнеры
	@echo "$(YELLOW)Перезапуск контейнеров...$(NC)"
	docker-compose restart

logs: ## Показать логи всех сервисов
	docker-compose logs -f

logs-client: ## Показать логи клиента
	docker-compose logs -f client

logs-server: ## Показать логи сервера
	docker-compose logs -f server

# Development команды
dev: ## Запустить в режиме разработки
	@echo "$(GREEN)Запуск development версии...$(NC)"
	docker-compose -f docker-compose.dev.yml up -d
	@echo "$(GREEN)✓ Development версия запущена!$(NC)"
	@echo "Frontend (hot-reload): http://localhost:3000"
	@echo "Backend: http://localhost:3001/api/v1"

dev-down: ## Остановить development версию
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Логи development версии
	docker-compose -f docker-compose.dev.yml logs -f

# Управление
status: ## Показать статус контейнеров
	docker-compose ps

shell-client: ## Войти в shell клиента
	docker-compose exec client sh

shell-server: ## Войти в shell сервера
	docker-compose exec server sh

# Очистка
clean: ## Остановить и удалить всё (контейнеры, образы, volumes)
	@echo "$(YELLOW)Полная очистка Docker ресурсов...$(NC)"
	docker-compose down -v --rmi all
	@echo "$(GREEN)✓ Очистка завершена$(NC)"

prune: ## Очистить неиспользуемые Docker ресурсы
	@echo "$(YELLOW)Очистка неиспользуемых ресурсов...$(NC)"
	docker system prune -f

# Полная перезагрузка
rebuild: down build up ## Пересобрать и запустить заново
	@echo "$(GREEN)✓ Приложение пересобрано и запущено!$(NC)"

# Тесты
test-client: ## Запустить тесты клиента
	@echo "$(GREEN)Запуск тестов клиента...$(NC)"
	cd client && npm run test:run

# Информация
info: ## Показать информацию о контейнерах
	@echo "$(GREEN)Информация о контейнерах:$(NC)"
	@docker-compose ps
	@echo "\n$(GREEN)Использование ресурсов:$(NC)"
	@docker stats --no-stream

health: ## Проверить health status контейнеров
	@echo "$(GREEN)Health check статус:$(NC)"
	@docker inspect --format='Client: {{.State.Health.Status}}' avito-moder-client 2>/dev/null || echo "Client: not running"
	@docker inspect --format='Server: {{.State.Health.Status}}' avito-moder-server 2>/dev/null || echo "Server: not running"

# Установка по умолчанию
.DEFAULT_GOAL := help

