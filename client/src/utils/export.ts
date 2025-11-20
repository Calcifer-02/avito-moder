import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { StatsSummary, ActivityData, DecisionsData, CategoriesData } from '@/types';
import { PTSansRegularBase64 } from '@/assets/fonts/PTSans-Regular-base64';

/**
 * Экспорт статистики в CSV с правильным форматированием
 */
export const exportToCSV = (
  summary: StatsSummary | undefined,
  activityData: ActivityData[] | undefined,
  categoriesData: CategoriesData | undefined,
  period: string
) => {
  if (!summary) return;

  const rows: string[][] = [];

  // Заголовок
  rows.push(['Статистика модератора']);
  rows.push([]);
  rows.push(['Период', getPeriodLabel(period)]);
  rows.push(['Дата создания', new Date().toLocaleString('ru-RU')]);
  rows.push([]);

  // Общая статистика
  rows.push(['ОБЩАЯ СТАТИСТИКА']);
  rows.push(['Показатель', 'Значение']);
  rows.push(['Всего проверено', summary.totalReviewed.toString()]);
  rows.push(['Проверено сегодня', summary.totalReviewedToday.toString()]);
  rows.push(['Одобрено', `${summary.approvedPercentage.toFixed(1)}%`]);
  rows.push(['Отклонено', `${summary.rejectedPercentage.toFixed(1)}%`]);
  rows.push(['На доработку', `${summary.requestChangesPercentage.toFixed(1)}%`]);
  rows.push(['Среднее время проверки', formatReviewTime(summary.averageReviewTime)]);
  rows.push(['За выбранный период', summary.totalReviewedThisWeek.toString()]);
  rows.push([]);

  // График активности
  if (activityData && activityData.length > 0) {
    rows.push(['ГРАФИК АКТИВНОСТИ ПО ДНЯМ']);
    rows.push(['Дата', 'Одобрено', 'Отклонено', 'На доработку', 'Всего']);
    activityData.forEach((day) => {
      const total = day.approved + day.rejected + day.requestChanges;
      const dateStr = new Date(day.date).toLocaleDateString('ru-RU');
      rows.push([
        dateStr,
        day.approved.toString(),
        day.rejected.toString(),
        day.requestChanges.toString(),
        total.toString()
      ]);
    });

    // Итоги
    const totalApproved = activityData.reduce((sum, day) => sum + day.approved, 0);
    const totalRejected = activityData.reduce((sum, day) => sum + day.rejected, 0);
    const totalChanges = activityData.reduce((sum, day) => sum + day.requestChanges, 0);
    const grandTotal = totalApproved + totalRejected + totalChanges;

    rows.push(['ИТОГО', totalApproved.toString(), totalRejected.toString(), totalChanges.toString(), grandTotal.toString()]);
    rows.push([]);
  }

  // Категории
  if (categoriesData && Object.keys(categoriesData).length > 0) {
    rows.push(['ПРОВЕРЕНО ПО КАТЕГОРИЯМ']);
    rows.push(['Категория', 'Количество', 'Процент']);

    const totalCount = Object.values(categoriesData).reduce((sum, count) => sum + (count as number), 0);

    Object.entries(categoriesData)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .forEach(([category, count]) => {
        const percentage = totalCount > 0 ? ((count as number / totalCount) * 100).toFixed(1) : '0.0';
        rows.push([category, String(count), `${percentage}%`]);
      });

    rows.push(['ИТОГО', totalCount.toString(), '100%']);
  }

  // Преобразуем в CSV с правильным экранированием
  const csvContent = rows.map(row =>
    row.map(cell => {
      // Экранируем ячейки с запятыми, кавычками или переносами строк
      const cellStr = String(cell);
      if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    }).join(',')
  ).join('\n');

  // Создаём Blob и скачиваем
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `статистика_${period}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Очищаем URL
  URL.revokeObjectURL(url);
};

/**
 * Генерация PDF отчёта с поддержкой кириллицы
 */
export const exportToPDF = (
  summary: StatsSummary | undefined,
  activityData: ActivityData[] | undefined,
  decisionsData: DecisionsData | undefined,
  categoriesData: CategoriesData | undefined,
  period: string
) => {
  if (!summary) return;

  // Создаем PDF с поддержкой Unicode
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    putOnlyUsedFonts: true,
    compress: true
  });

  // Регистрируем шрифт PT Sans для поддержки кириллицы
  doc.addFileToVFS('PTSans-Regular.ttf', PTSansRegularBase64);
  doc.addFont('PTSans-Regular.ttf', 'PTSans', 'normal');
  doc.setFont('PTSans');

  let yPosition = 20;

  // Заголовок
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.setFont('PTSans', 'normal');
  doc.text('Статистика модератора', 105, yPosition, { align: 'center' });
  yPosition += 10;

  // Период
  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.setFont('PTSans', 'normal');
  doc.text(`Период: ${getPeriodLabel(period)}`, 105, yPosition, { align: 'center' });
  yPosition += 5;

  doc.setFontSize(10);
  doc.text(`Создано: ${new Date().toLocaleString('ru-RU')}`, 105, yPosition, { align: 'center' });
  yPosition += 15;

  // Общая статистика
  doc.setFontSize(14);
  doc.setTextColor(40, 40, 40);
  doc.setFont('PTSans', 'normal');
  doc.text('Общая статистика', 14, yPosition);
  yPosition += 5;

  const summaryData = [
    ['Показатель', 'Значение'],
    ['Всего проверено', summary.totalReviewed.toString()],
    ['Проверено сегодня', summary.totalReviewedToday.toString()],
    ['Одобрено', `${summary.approvedPercentage.toFixed(1)}%`],
    ['Отклонено', `${summary.rejectedPercentage.toFixed(1)}%`],
    ['На доработку', `${summary.requestChangesPercentage.toFixed(1)}%`],
    ['Среднее время проверки', formatReviewTime(summary.averageReviewTime)],
    ['За период', summary.totalReviewedThisWeek.toString()],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: 'striped',
    headStyles: {
      fillColor: [0, 170, 255],
      fontSize: 11,
      fontStyle: 'normal',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 10
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    margin: { left: 14, right: 14 },
    styles: {
      font: 'PTSans',
      cellPadding: 4
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // График активности
  if (activityData && activityData.length > 0) {
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('PTSans', 'normal');
    doc.text('График активности по дням', 14, yPosition);
    yPosition += 5;

    const activityTableData = activityData.map((day) => {
      const total = day.approved + day.rejected + day.requestChanges;
      const dateStr = new Date(day.date).toLocaleDateString('ru-RU');
      return [
        dateStr,
        day.approved.toString(),
        day.rejected.toString(),
        day.requestChanges.toString(),
        total.toString()
      ];
    });

    // Добавляем итоговую строку
    const totalApproved = activityData.reduce((sum, day) => sum + day.approved, 0);
    const totalRejected = activityData.reduce((sum, day) => sum + day.rejected, 0);
    const totalChanges = activityData.reduce((sum, day) => sum + day.requestChanges, 0);
    const grandTotal = totalApproved + totalRejected + totalChanges;

    activityTableData.push([
      'ИТОГО',
      totalApproved.toString(),
      totalRejected.toString(),
      totalChanges.toString(),
      grandTotal.toString()
    ]);

    autoTable(doc, {
      startY: yPosition,
      head: [['Дата', 'Одобрено', 'Отклонено', 'На доработку', 'Всего']],
      body: activityTableData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 170, 255],
        fontSize: 10,
        fontStyle: 'normal'
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 35 },
        1: { halign: 'center', cellWidth: 25 },
        2: { halign: 'center', cellWidth: 25 },
        3: { halign: 'center', cellWidth: 30 },
        4: { halign: 'center', fontStyle: 'normal', cellWidth: 25 }
      },
      margin: { left: 14, right: 14 },
      styles: {
        font: 'PTSans'
      },
      didParseCell: (data) => {
        // Выделяем итоговую строку
        if (data.row.index === activityTableData.length - 1 && data.section === 'body') {
          data.cell.styles.fontStyle = 'normal';
          data.cell.styles.fillColor = [240, 240, 240];
        }
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Распределение решений
  if (decisionsData) {
    if (yPosition > 230) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('PTSans', 'normal');
    doc.text('Распределение решений', 14, yPosition);
    yPosition += 5;

    const decisionsTableData = [
      ['Одобрено', `${decisionsData.approved.toFixed(1)}%`, '🟢'],
      ['Отклонено', `${decisionsData.rejected.toFixed(1)}%`, '🔴'],
      ['На доработку', `${decisionsData.requestChanges.toFixed(1)}%`, '🟡'],
    ];

    autoTable(doc, {
      startY: yPosition,
      head: [['Тип решения', 'Процент', '']],
      body: decisionsTableData,
      theme: 'plain',
      headStyles: {
        fillColor: [0, 170, 255],
        fontSize: 11,
        fontStyle: 'normal'
      },
      bodyStyles: {
        fontSize: 10
      },
      columnStyles: {
        1: { halign: 'center', fontStyle: 'normal' },
        2: { halign: 'center', cellWidth: 15 }
      },
      margin: { left: 14, right: 14 },
      styles: {
        font: 'PTSans'
      }
    });

    yPosition = (doc as any).lastAutoTable.finalY + 15;
  }

  // Категории
  if (categoriesData && Object.keys(categoriesData).length > 0) {
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('PTSans', 'normal');
    doc.text('Проверено по категориям', 14, yPosition);
    yPosition += 5;

    const totalCount = Object.values(categoriesData).reduce((sum, count) => sum + (count as number), 0);

    const categoriesTableData = Object.entries(categoriesData)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .map(([category, count]) => {
        const percentage = totalCount > 0 ? ((count as number / totalCount) * 100).toFixed(1) : '0.0';
        return [category, String(count), `${percentage}%`];
      });

    // Добавляем итого
    categoriesTableData.push(['ИТОГО', totalCount.toString(), '100%']);

    autoTable(doc, {
      startY: yPosition,
      head: [['Категория', 'Количество', 'Доля']],
      body: categoriesTableData,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 170, 255],
        fontSize: 10,
        fontStyle: 'normal'
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        1: { halign: 'center' },
        2: { halign: 'center' }
      },
      alternateRowStyles: {
        fillColor: [248, 248, 248]
      },
      margin: { left: 14, right: 14 },
      styles: {
        font: 'PTSans'
      },
      didParseCell: (data) => {
        // Выделяем итоговую строку
        if (data.row.index === categoriesTableData.length - 1 && data.section === 'body') {
          data.cell.styles.fontStyle = 'normal';
          data.cell.styles.fillColor = [0, 170, 255];
          data.cell.styles.textColor = [255, 255, 255];
        }
      }
    });
  }

  // Футер на каждой странице
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.setFont('PTSans', 'normal');

    // Линия перед футером
    const pageHeight = doc.internal.pageSize.height;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, pageHeight - 15, doc.internal.pageSize.width - 14, pageHeight - 15);

    doc.text(
      `Сгенерировано: ${new Date().toLocaleString('ru-RU')}`,
      14,
      pageHeight - 10
    );
    doc.text(
      `Страница ${i} из ${pageCount}`,
      doc.internal.pageSize.width - 14,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Сохранение с русским названием
  doc.save(`отчет_${period}_${new Date().toISOString().split('T')[0]}.pdf`);
};

/**
 * Получить текстовое описание периода
 */
const getPeriodLabel = (period: string): string => {
  switch (period) {
    case 'today':
      return 'Сегодня';
    case 'week':
      return 'Неделя';
    case 'month':
      return 'Месяц';
    case 'custom':
      return 'Произвольный период';
    default:
      return period;
  }
};

/**
 * Форматирование времени проверки
 */
const formatReviewTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}м ${secs}с`;
};

