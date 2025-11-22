# Быстрый старт с Docker

## Запуск за 3 команды

```bash
# 1. Перейти в папку проекта
cd avito-int3

# 2. Собрать и запустить
docker-compose up -d --build

# 3. Открыть в браузере
start http://localhost:3000
```

## Для Windows (PowerShell)

```powershell
# Использовать готовый скрипт
.\docker.ps1 up

# Или напрямую
docker-compose up -d --build
```

## Для Linux/Mac (с Make)

```bash
# Использовать Makefile
make up

# Или напрямую
docker-compose up -d --build
```

## Проверка статуса

```bash
docker-compose ps
```

## Просмотр логов

```bash
docker-compose logs -f
```

## Остановка

```bash
docker-compose down
```

## Development режим (с hot-reload)

```bash
docker-compose -f docker-compose.dev.yml up -d
```

---

**Готово!** Приложение доступно по адресу:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001/api/v1

Подробная документация: [DOCKER.md](./DOCKER.md)

