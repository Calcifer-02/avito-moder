# Dockerfile для сервера (backend)
FROM node:20-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY . .

# Открываем порт 3001
EXPOSE 3001

# Переменные окружения
ENV NODE_ENV=production
ENV PORT=3001

# Запускаем сервер
CMD ["node", "server.js"]

