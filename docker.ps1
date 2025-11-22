# Docker Management Script for Windows
# Использование: .\docker.ps1 <команда>

param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

function Write-ColorOutput($ForegroundColor) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    if ($args) {
        Write-Output $args
    }
    $host.UI.RawUI.ForegroundColor = $fc
}

function Show-Help {
    Write-ColorOutput Green "=== Avito Moderation System - Docker Commands ==="
    Write-Output ""
    Write-ColorOutput Yellow "Production команды:"
    Write-Output "  build       - Собрать Docker образы"
    Write-Output "  up          - Запустить приложение"
    Write-Output "  down        - Остановить контейнеры"
    Write-Output "  restart     - Перезапустить контейнеры"
    Write-Output "  logs        - Показать логи"
    Write-Output "  status      - Показать статус контейнеров"
    Write-Output ""
    Write-ColorOutput Yellow "Development команды:"
    Write-Output "  dev         - Запустить в режиме разработки"
    Write-Output "  dev-down    - Остановить development версию"
    Write-Output "  dev-logs    - Логи development версии"
    Write-Output ""
    Write-ColorOutput Yellow "Очистка:"
    Write-Output "  clean       - Удалить всё (контейнеры, образы, volumes)"
    Write-Output "  rebuild     - Пересобрать и запустить заново"
    Write-Output ""
    Write-ColorOutput Yellow "Другое:"
    Write-Output "  info        - Информация о контейнерах"
    Write-Output "  health      - Health check статус"
    Write-Output "  help        - Показать эту справку"
    Write-Output ""
}

switch ($Command.ToLower()) {
    "build" {
        Write-ColorOutput Green "Сборка production образов..."
        docker-compose build
    }
    "up" {
        Write-ColorOutput Green "Запуск production версии..."
        docker-compose up -d
        Write-ColorOutput Green "`n✓ Приложение запущено!"
        Write-Output "Frontend: http://localhost:3000"
        Write-Output "Backend: http://localhost:3001/api/v1"
    }
    "down" {
        Write-ColorOutput Yellow "Остановка контейнеров..."
        docker-compose down
    }
    "restart" {
        Write-ColorOutput Yellow "Перезапуск контейнеров..."
        docker-compose restart
    }
    "logs" {
        docker-compose logs -f
    }
    "dev" {
        Write-ColorOutput Green "Запуск development версии..."
        docker-compose -f docker-compose.dev.yml up -d
        Write-ColorOutput Green "`n✓ Development версия запущена!"
        Write-Output "Frontend (hot-reload): http://localhost:3000"
        Write-Output "Backend: http://localhost:3001/api/v1"
    }
    "dev-down" {
        docker-compose -f docker-compose.dev.yml down
    }
    "dev-logs" {
        docker-compose -f docker-compose.dev.yml logs -f
    }
    "status" {
        docker-compose ps
    }
    "clean" {
        Write-ColorOutput Yellow "Полная очистка Docker ресурсов..."
        docker-compose down -v --rmi all
        Write-ColorOutput Green "✓ Очистка завершена"
    }
    "rebuild" {
        Write-ColorOutput Yellow "Пересборка приложения..."
        docker-compose down
        docker-compose build
        docker-compose up -d
        Write-ColorOutput Green "✓ Приложение пересобрано и запущено!"
    }
    "info" {
        Write-ColorOutput Green "Информация о контейнерах:"
        docker-compose ps
        Write-Output ""
        Write-ColorOutput Green "Использование ресурсов:"
        docker stats --no-stream
    }
    "health" {
        Write-ColorOutput Green "Health check статус:"
        docker inspect --format='Client: {{.State.Health.Status}}' avito-moder-client 2>$null
        if ($LASTEXITCODE -ne 0) { Write-Output "Client: not running" }
        docker inspect --format='Server: {{.State.Health.Status}}' avito-moder-server 2>$null
        if ($LASTEXITCODE -ne 0) { Write-Output "Server: not running" }
    }
    "help" {
        Show-Help
    }
    default {
        Write-ColorOutput Red "Неизвестная команда: $Command"
        Write-Output ""
        Show-Help
    }
}

