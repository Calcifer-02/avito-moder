# Docker Deployment Guide

Руководство по запуску проекта Avito Moderation System в Docker контейнерах.

## Требования

- Docker Engine 20.10+
- Docker Compose 2.0+
- 2GB свободной RAM
- 5GB свободного дискового пространства

## Быстрый старт

### 1. Клонируйте репозиторий (если еще не сделано)

```bash
git clone https://github.com/Calcifer-02/avito-moder.git
cd avito-moder
```

### 2. Запуск приложения

```bash
# Сборка и запуск всех сервисов
docker-compose up --build

# Или в фоновом режиме (detached mode)
docker-compose up -d --build
```

### 3. Доступ к приложению

- **Frontend (Client):** http://localhost:3000
- **Backend (Server API):** http://localhost:3001/api/v1

## Структура Docker

```
avito-moder/
├── docker-compose.yml              # Оркестрация контейнеров
├── client/                         # Frontend
│   ├── Dockerfile                  # Multi-stage build для React
│   ├── nginx.conf                  # Конфигурация Nginx
│   └── .dockerignore              # Исключения для Docker
└── tech-int3-server/              # Backend
    ├── Dockerfile                  # Node.js сервер
    └── .dockerignore              # Исключения для Docker
```

## Docker Compose команды

### Управление контейнерами

```bash
# Запуск сервисов
docker-compose up                    # В терминале (с логами)
docker-compose up -d                 # В фоновом режиме

# Пересборка образов
docker-compose build                 # Пересобрать все образы
docker-compose build client          # Пересобрать только client
docker-compose build server          # Пересобрать только server

# Запуск с пересборкой
docker-compose up --build           # Пересобрать и запустить

# Остановка сервисов
docker-compose stop                  # Остановить контейнеры
docker-compose down                  # Остановить и удалить контейнеры
docker-compose down -v              # Удалить контейнеры и volumes

# Перезапуск
docker-compose restart              # Перезапустить все сервисы
docker-compose restart client       # Перезапустить только client
docker-compose restart server       # Перезапустить только server
```

### Просмотр логов

```bash
# Логи всех сервисов
docker-compose logs

# Логи с отслеживанием (follow)
docker-compose logs -f

# Логи конкретного сервиса
docker-compose logs client
docker-compose logs server

# Последние N строк логов
docker-compose logs --tail=100 server
```

### Мониторинг

```bash
# Статус контейнеров
docker-compose ps

# Использование ресурсов
docker stats

# Healthcheck статус
docker inspect --format='{{.State.Health.Status}}' avito-moder-client
docker inspect --format='{{.State.Health.Status}}' avito-moder-server
```

## Архитектура контейнеров

### Client Container (Frontend)

**Multi-stage build:**
1. **Builder stage:** 
   - Базовый образ: `node:20-alpine`
   - Устанавливает зависимости
   - Собирает React приложение (`npm run build`)

2. **Production stage:**
   - Базовый образ: `nginx:alpine`
   - Копирует собранные файлы из builder
   - Настраивает Nginx для SPA
   - Проксирует `/api/*` запросы к backend

**Особенности:**
- Размер образа: ~25-30 MB (благодаря alpine)
- Gzip сжатие статики
- Кэширование статических файлов (1 год)
- SPA routing (fallback на index.html)
- Reverse proxy для API

### Server Container (Backend)

**Production build:**
- Базовый образ: `node:20-alpine`
- Устанавливает только production зависимости
- Запускает Express сервер на порту 3001

**Особенности:**
- Размер образа: ~100-150 MB
- Healthcheck проверка доступности API
- Auto-restart при падении

### Сеть

**avito-network (bridge):**
- Изолированная сеть для всех сервисов
- Client может обращаться к Server по имени `server:3001`
- Внешние порты:
  - `3000:80` - Client (Nginx)
  - `3001:3001` - Server (API)

## Health Checks

### Client Health Check
```yaml
test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:80"]
interval: 30s
timeout: 10s
retries: 3
start_period: 20s
```

### Server Health Check
```yaml
test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3001/api/v1/ads"]
interval: 30s
timeout: 10s
retries: 3
start_period: 40s
```

## Development режим

Для разработки с hot-reload создайте отдельный `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  server:
    build:
      context: ./tech-int3-server
    volumes:
      - ./tech-int3-server:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: npm run dev

  client:
    build:
      context: ./client
      target: builder
    volumes:
      - ./client:/app
      - /app/node_modules
    ports:
      - "3000:5173"
    environment:
      - NODE_ENV=development
    command: npm run dev
```

Запуск:
```bash
docker-compose -f docker-compose.dev.yml up
```

## Troubleshooting

### Проблема: Контейнер не запускается

```bash
# Проверить логи
docker-compose logs server
docker-compose logs client

# Проверить статус
docker-compose ps

# Пересобрать без кэша
docker-compose build --no-cache
```

### Проблема: Порты заняты

```bash
# Проверить, что порты 3000 и 3001 свободны
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# Или измените порты в docker-compose.yml
ports:
  - "8080:80"     # Client на порту 8080
  - "8001:3001"   # Server на порту 8001
```

### Проблема: Client не может подключиться к Server

```bash
# Проверить сеть
docker network inspect avito-network

# Проверить DNS resolution
docker-compose exec client ping server

# Проверить конфигурацию Nginx
docker-compose exec client cat /etc/nginx/conf.d/default.conf
```

### Проблема: Изменения не применяются

```bash
# Остановить и удалить всё
docker-compose down

# Очистить образы и volumes
docker-compose down --rmi all -v

# Пересобрать с нуля
docker-compose up --build --force-recreate
```



### Ускорение сборки

```bash
# Используйте BuildKit (Docker 18.09+)
DOCKER_BUILDKIT=1 docker-compose build

# Кэширование слоев
docker-compose build --parallel
```

## Production рекомендации

1. **Переменные окружения:**
   ```yaml
   # Создайте .env файл
   NODE_ENV=production
   API_URL=https://your-domain.com/api
   ```

2. **HTTPS:**
   - Добавьте SSL сертификаты
   - Используйте Traefik или Caddy как reverse proxy

3. **Масштабирование:**
   ```bash
   # Несколько инстансов server
   docker-compose up --scale server=3
   ```

4. **Мониторинг:**
   - Добавьте Prometheus для метрик
   - Используйте ELK stack для логов

5. **Backup:**
   ```bash
   # Если добавите volumes для данных
   docker run --rm -v server-data:/data -v $(pwd):/backup alpine tar czf /backup/backup.tar.gz /data
   ```

## Полезные команды

```bash
# Войти в контейнер
docker-compose exec server sh
docker-compose exec client sh

# Выполнить команду в контейнере
docker-compose exec server npm run test
docker-compose exec client ls -la /usr/share/nginx/html

# Очистить все Docker ресурсы
docker system prune -a --volumes

# Посмотреть использование места
docker system df
```

## Итоговая команда для запуска

```bash
# Из корневой директории проекта
docker-compose up -d --build

# Проверить статус
docker-compose ps

# Открыть в браузере
start http://localhost:3000
```

## Быстрая остановка и очистка

```bash
# Остановить и удалить всё
docker-compose down -v --rmi all

# Или
docker-compose down && docker system prune -f
```
