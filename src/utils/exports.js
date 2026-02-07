/**
 * Export and Print Utilities
 * Functions for exporting data to Excel and printing documents
 */

/**
 * Export data to Excel format
 * @param {Array} data - Array of objects to export
 * @param {string} filename - Name for the exported file
 */
export const exportToExcel = (data, filename = 'export.xlsx') => {
  // TODO: Implement Excel export functionality
  // This would typically use a library like xlsx or exceljs
  console.log('Exporting to Excel:', filename, data);
  
  // Placeholder implementation
  try {
    // Convert data to CSV as a simple alternative
    if (!data || data.length === 0) {
      console.warn('No data to export');
      return;
    }

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header];
        // Handle values that contain commas
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename.replace('.xlsx', '.csv'));
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('Export completed successfully');
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
};

/**
 * Print a document/report
 * @param {string} elementId - ID of the element to print
 */
export const printDocument = (elementId) => {
  try {
    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error('Element not found:', elementId);
      return;
    }

    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    // Copy styles and content
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Печать документа</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          ${element.innerHTML}
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    // Wait for content to load, then print
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    
  } catch (error) {
    console.error('Error printing document:', error);
  }
};

/**
 * Print debts report
 * @param {Array} debts - Array of debt objects
 */
export const printDebts = (debts) => {
  try {
    if (!debts || debts.length === 0) {
      console.warn('No debts to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    const totalDebt = debts.reduce((sum, debt) => sum + (debt.amount || 0), 0);
    const currentDate = new Date().toLocaleDateString('ru-RU');

    const debtRows = debts.map(debt => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${debt.clientName || 'Неизвестно'}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${debt.description || '-'}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${(debt.amount || 0).toLocaleString()} сум</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${debt.date || '-'}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Отчет по долгам</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #4f46e5; color: white; padding: 10px; text-align: left; }
            .total { margin-top: 20px; font-size: 18px; font-weight: bold; text-align: right; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Отчет по долгам</h1>
          <p style="text-align: center; color: #666;">Дата: ${currentDate}</p>
          <table>
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Описание</th>
                <th>Сумма</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              ${debtRows}
            </tbody>
          </table>
          <div class="total">
            Общая сумма долгов: ${totalDebt.toLocaleString()} сум
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    
  } catch (error) {
    console.error('Error printing debts:', error);
  }
};

/**
 * Print financial report
 * @param {Object} reportData - Report data with revenue, expenses, etc.
 */
export const printReport = (reportData) => {
  try {
    if (!reportData) {
      console.warn('No report data to print');
      return;
    }

    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      console.error('Could not open print window');
      return;
    }

    const {
      dateFrom = 'Н/Д',
      dateTo = 'Н/Д',
      revenue = 0,
      expenses = 0,
      profit = 0,
      checkIns = 0,
      checkOuts = 0,
      occupancyRate = 0
    } = reportData;

    const currentDate = new Date().toLocaleDateString('ru-RU');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Финансовый отчет</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; color: #333; }
            .period { text-align: center; color: #666; font-size: 14px; margin-bottom: 30px; }
            .report-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .report-section h2 { color: #4f46e5; margin-top: 0; }
            .report-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .report-row:last-child { border-bottom: none; }
            .label { font-weight: 500; }
            .value { font-weight: bold; color: #333; }
            .profit { color: #10b981; }
            .loss { color: #ef4444; }
            .footer { margin-top: 30px; text-align: center; color: #999; font-size: 12px; }
            @media print {
              body { padding: 0; }
            }
          </style>
        </head>
        <body>
          <h1>Финансовый отчет</h1>
          <div class="period">
            <p>Период: ${dateFrom} - ${dateTo}</p>
            <p>Дата формирования: ${currentDate}</p>
          </div>

          <div class="report-section">
            <h2>Финансовые показатели</h2>
            <div class="report-row">
              <span class="label">Доход:</span>
              <span class="value">${revenue.toLocaleString()} сум</span>
            </div>
            <div class="report-row">
              <span class="label">Расход:</span>
              <span class="value">${expenses.toLocaleString()} сум</span>
            </div>
            <div class="report-row">
              <span class="label">Прибыль:</span>
              <span class="value ${profit >= 0 ? 'profit' : 'loss'}">
                ${profit.toLocaleString()} сум
              </span>
            </div>
          </div>

          <div class="report-section">
            <h2>Операционные показатели</h2>
            <div class="report-row">
              <span class="label">Заселений:</span>
              <span class="value">${checkIns}</span>
            </div>
            <div class="report-row">
              <span class="label">Выселений:</span>
              <span class="value">${checkOuts}</span>
            </div>
            <div class="report-row">
              <span class="label">Загруженность:</span>
              <span class="value">${occupancyRate}%</span>
            </div>
          </div>

          <div class="footer">
            <p>© Hostella Management System</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 250);
    
  } catch (error) {
    console.error('Error printing report:', error);
  }
};
