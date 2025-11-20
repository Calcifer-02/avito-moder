/**
 * Скрипт для конвертации TTF шрифта в base64 для jsPDF
 * Запуск: node scripts/convertFont.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const fontPath = path.join(__dirname, '../src/assets/fonts/PTSans-Regular.ttf');
const outputPath = path.join(__dirname, '../src/assets/fonts/PTSans-Regular-base64.ts');

try {
  // Читаем TTF файл
  const fontBuffer = fs.readFileSync(fontPath);

  // Конвертируем в base64
  const base64Font = fontBuffer.toString('base64');

  // Создаем TypeScript файл с base64 строкой
  const content = `/**
 * PT Sans Regular font в base64 формате для jsPDF
 * Автоматически сгенерировано из PTSans-Regular.ttf
 */

export const PTSansRegularBase64 = '${base64Font}';
`;

  // Записываем файл
  fs.writeFileSync(outputPath, content);

  console.log('Шрифт успешно конвертирован!');
  console.log(`Файл создан: ${outputPath}`);
  console.log(`Размер: ${(base64Font.length / 1024).toFixed(2)} KB`);
} catch (error) {
  console.error('Ошибка при конвертации:', error);
  process.exit(1);
}

