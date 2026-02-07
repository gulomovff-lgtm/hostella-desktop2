import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { inputClass, labelClass } from '../../constants/config';
import { formatCurrency } from '../../utils/calculations';
import { getCurrentDate } from '../../utils/dateHelpers';

const ReportsView = ({ onGenerateReport }) => {
  const [dateRange, setDateRange] = useState({
    startDate: getCurrentDate(),
    endDate: getCurrentDate(),
  });
  const [reportData, setReportData] = useState(null);
  
  const handleGenerate = () => {
    const data = onGenerateReport?.(dateRange);
    setReportData(data);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Отчеты</h2>
      
      <Card title="Фильтры">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className={labelClass}>От</label>
            <input type="date" value={dateRange.startDate} onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>До</label>
            <input type="date" value={dateRange.endDate} onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})} className={inputClass} />
          </div>
          <Button onClick={handleGenerate}>Сгенерировать</Button>
        </div>
      </Card>
      
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card title="Доход">
            <p className="text-3xl font-bold text-green-600">{formatCurrency(reportData.revenue || 0)}</p>
          </Card>
          <Card title="Расходы">
            <p className="text-3xl font-bold text-red-600">{formatCurrency(reportData.expenses || 0)}</p>
          </Card>
          <Card title="Прибыль">
            <p className="text-3xl font-bold text-blue-600">{formatCurrency((reportData.revenue || 0) - (reportData.expenses || 0))}</p>
          </Card>
        </div>
      )}
      
      {!reportData && (
        <div className="text-center py-12 text-slate-400">
          <p className="text-6xl mb-4">📊</p>
          <p>Выберите даты и сгенерируйте отчет</p>
        </div>
      )}
    </div>
  );
};

export default ReportsView;
